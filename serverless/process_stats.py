import simplejson as json
from bson.objectid import ObjectId
import numpy as np
from pprint import pprint
import pandas as pd
from datetime import date, datetime, timedelta
from dateutil.relativedelta import relativedelta
import time
from collections import Counter
from app import app
from ddb import client

from station_stats import safe_divide, safe_int, round_time, calc_daily_working_seconds, working_seconds_between_datetimes, shift_on_date, generate_station_summaries_until_date, summarize_station_events


db = client.ContactDB


@app.route('/process_summaries', methods=['DELETE'])
def process_status_delete_all_process_summaries():
    db.process_summaries.delete_many({})


def serializeDayStats(obj):
    if isinstance(obj, np.integer):
        return safe_int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, datetime):
        return obj.replace(second=0, microsecond=0).time().__str__()[:-3]
    elif isinstance(obj, date):
        return obj.__str__()


def serializeMultiDayStats(obj):
    if isinstance(obj, np.integer):
        return safe_int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, datetime):
        return obj.date().__str__()
    elif isinstance(obj, date):
        return obj.__str__()


def generate_process_statistics(process_id, start_date, end_date=None):
    """Called by the API to generate either a single-day summary or a multi-day summary

    Args:
        process_id (str): ID of the process to generate statistics for
        product_group_id (str): ID of the product group in the process to generate stats for (one product group per statistics payload)
        start_date (datetime.date): Start date of the statistics
        end_date (datetime.date, optional): End date of the statistics. Defaults to None, which means it will generate a single-day statistics payload

    Returns:
        str: a serialized payload of the statistics dict that is rendered on the frontend
    """

    if end_date is None:
        start_date = datetime.fromtimestamp(start_date/1000)

        # This is a single day query, generate stats based on events for that day
        min_datetime = datetime.combine(start_date, datetime.min.time())
        max_datetime = datetime.combine(start_date, datetime.max.time())

        stats = generate_process_statistics_from_events(
            process_id, min_datetime, max_datetime)
        return json.dumps(stats, ignore_nan=True, default=serializeDayStats)

    else:
        start_date = datetime.fromtimestamp(start_date/1000)
        end_date = datetime.fromtimestamp(end_date/1000)

        # This is a multi day query, generate stats based on summaries
        min_datetime = datetime.combine(start_date, datetime.min.time())
        max_datetime = datetime.combine(end_date, datetime.max.time())

        process = db.processes.find_one({'_id': process_id})
        process_station_ids = [node['stationID']
                               for node in process['flattened_stations']]
        for station_id in process_station_ids:
            generate_station_summaries_until_date(station_id, max_datetime)
        generate_process_summaries_until_date(process_id, max_datetime)

        process_station_ids = [node['stationID']
                               for node in process['flattened_stations']]

        # Get Summaries
        summaries = list(db.process_summaries.find({
            'process_id': process_id,
            'datetime': {
                '$gte': min_datetime,
                '$lte': max_datetime
            }
        }).sort('datetime', 1))

        # If the end date for the multi-day summary is today we need to generate temporary
        # summaries for each station in the process
        if max_datetime.date() == datetime.now().date():
            print("TEMP SUMMARY FOR", max_datetime.date())

            temp_station_summaries = []
            temp_summary_start = datetime.combine(
                max_datetime, datetime.min.time())
            for station_id in process_station_ids:
                station = db.stations.find_one({'_id': station_id})
                print('    TEMP STATION SUMMARY FOR {}'.format(
                    station['name']))
                touch_events = list(db.touch_events.find({
                    'load_station_id': station_id,
                    'move_datetime': {
                        '$gte': temp_summary_start,
                        '$lte': max_datetime
                    }
                }).sort('_id', 1))
                report_events = list(db.report_events.find({
                    'station_id': station_id,
                    'datetime': {
                        '$gte': temp_summary_start,
                        '$lte': max_datetime
                    }
                }).sort('_id', 1))

                new_temp_summary = summarize_station_events(
                    touch_events, report_events, station, temp_summary_start)
                temp_station_summaries.append(new_temp_summary)

            temp_process_summary = summarize_process_events(process, temp_station_summaries, datetime.combine(
                max_datetime.date(), datetime.min.time()), max_datetime)
            summaries.append(temp_process_summary)

        print('Generating process statistics from {} summaries ({} -> {})'.format(
            len(summaries), min_datetime, max_datetime))

        stats = generate_process_statistics_from_summaries(
            summaries, process_id)
        return json.dumps(stats, ignore_nan=True, default=serializeMultiDayStats)


def generate_process_statistics_from_events(process_id, min_datetime, max_datetime):

    touch_events = list(db.touch_events.find({
        'process_id': process_id,
        'move_datetime': {
            '$gte': min_datetime,
            '$lte': max_datetime
        }
    }).sort('move_datetime', 1))

    # To be able to look back in time, we store the station configuration of processes.
    # Look at the stations in this process as of the most recent summary (in the date range)
    last_summaries = list(db.process_summaries.find({
        'process_id': process_id,
        'datetime': {'$lte': max_datetime}
    }).sort('datetime', 1).limit(1))
    if len(last_summaries):
        process_station_ids = last_summaries[0]['station_ids']
        process_routes = last_summaries[0]['routes']
    else:
        process = db.processes.find_one({'_id': process_id})
        process_station_ids = [node['stationID']
                               for node in process['flattened_stations']]
        process_routes = list(db.tasks.find({'processId': process_id}))

    print('Generating process stats from {} touch events ({})'.format(
        len(touch_events), min_datetime.date()))

    stats = {
        'production_rates': [],
        'lead_time': 0,
        'total_throughputs': [],
        'wip': [],
        'throughput': [],
        'balance': []
    }

    if len(touch_events) == 0:
        return stats

    touches_df = pd.DataFrame(touch_events).set_index('move_datetime')

    product_group_ids = list(touches_df['product_group_id'].unique())
    product_groups = list(db.lot_templates.find(
        {'_id': {'$in': product_group_ids}}))
    # Map to normalized object
    product_groups = {
        product_group['_id']: product_group for product_group in product_groups}

    process_stations_nrml = {station['_id']: station for station in db.stations.find(
        {'_id': {'$in': process_station_ids}})}

    shift_details = db.settings.find_one()['shiftDetails']
    shift_start_time = datetime.strptime(
        shift_details['startOfShift'], '%H:%M')
    shift_end_time = datetime.strptime(shift_details['endOfShift'], '%H:%M')

    [day_start, day_end] = shift_on_date(
        min_datetime, shift_start_time, shift_end_time)
    start_hour = round_time(
        min([touch_events[0]['move_datetime'], day_start]), timedelta(hours=1), 'floor')
    end_hour = round_time(max([touch_events[-1]['move_datetime'], day_end]),
                          timedelta(hours=1), 'ceil') - timedelta(seconds=1)
    delta_hours = (end_hour - start_hour).seconds // 3600

    # ===== Store all unload_station_ids that would indicate a lot was finished
    load_station_ids = [route['load'] for route in process_routes]
    unload_station_ids = [route['unload'] for route in process_routes]
    end_station_ids = ['FINISH']
    for unload_station_id in unload_station_ids:
        if unload_station_id not in load_station_ids and process_stations_nrml[unload_station_id]['type'] == 'warehouse':
            end_station_ids.append(unload_station_id)

    # ===== Shift Information
    daily_working_seconds = calc_daily_working_seconds(shift_details)
    working_seconds = working_seconds_between_datetimes(
        shift_details, min_datetime, max_datetime)

    # --- Production Rate
    production_rates = {}
    total_throughputs = {}
    for pg_id in product_group_ids:
        pg_finished_qty = safe_int(touches_df[(touches_df['product_group_id'] == pg_id) & (
            touches_df['unload_station_id'].isin(end_station_ids))]['quantity'].sum())
        total_throughputs[pg_id] = pg_finished_qty
        production_rates[pg_id] = safe_int(
            safe_divide(working_seconds, pg_finished_qty))
    total_finished_qty = safe_int(
        touches_df[touches_df['unload_station_id'].isin(end_station_ids)]['quantity'].sum())
    stats['production_rates'] = {
        'total': safe_int(safe_divide(working_seconds, total_finished_qty)),
        'data': [{'label': product_groups[key]['name'] if key in product_groups else '???', 'value': value} for key, value in production_rates.items()]
    }
    stats['total_throughputs'] = {
        'total': total_finished_qty,
        'data': [{'label': product_groups[key]['name'] if key in product_groups else '???', 'value': value} for key, value in total_throughputs.items()]
    }

    # --- WIP
    current_wip = {}
    for station_id in process_station_ids:
        latest_station_events = list(db.touch_events.find({'load_station_id': station_id, 'move_datetime': {
                                     '$lte': max_datetime}}).sort('move_datetime', -1).limit(1))
        if len(latest_station_events) > 0:
            for pg_id, qty in latest_station_events[0]['current_wip'].items():
                if pg_id in current_wip:
                    current_wip[pg_id] += qty
                else:
                    current_wip[pg_id] = qty

    stats['wip'] = {
        'total': sum([pg_wip for pg_wip in current_wip.values()]),
        'data': [{'label': product_groups[key]['name'] if key in product_groups else '???', 'value': value} for key, value in current_wip.items() if key in product_group_ids]
    }

    # --- Lead Time
    # The ratio of how much of the day (86400 seconds) is working seconds
    stats['lead_time'] = safe_divide(
        stats['production_rates']['total'] * stats['wip']['total'] * 86400, daily_working_seconds)

    # --- Balance
    balance = {}
    for pg_id in product_group_ids:
        balance[pg_id] = []
        for station_id in process_station_ids:
            # lastest_pg_events = touches_df[touches_df['product_group_id'] == pg_id].drop_duplicates('load_station_id', keep='last')
            # lastest_pg_events.set_index(['load_station_id'])
            # pg_cycle_times = pd.Series(lastest_pg_events.pgs_cycle_time.values,index=lastest_pg_events.load_station_id).to_dict()
            # print(pg_cycle_times)

            # balance[pg_id] = [{
            #     'Station': process_stations_nrml[station_id]['name'] if station_id in process_stations_nrml else '???',
            #     'Cycle Time': pg_cycle_times[station_id] if station_id in pg_cycle_times else 0
            # } for station_id in process_station_ids]

            # this new way queries the most recent event in that product group, no matter if it was part of that day or not
            latest_pg_station_event = list(db.touch_events.find({'product_group_id': pg_id, 'load_station_id': station_id, 'move_datetime': {
                                           '$lte': max_datetime}}).sort('move_datetime', -1).limit(1))
            if len(latest_pg_station_event) > 0:
                cycle_time = latest_pg_station_event[0]['pgs_cycle_time']
            else:
                cycle_time = 0

            balance[pg_id].append({
                'Station': process_stations_nrml[station_id]['name'] if station_id in process_stations_nrml else '???',
                'Cycle Time': cycle_time
            })

    stats['balance'] = balance

    # --- Throughput
    out_touches_df = touches_df[touches_df['unload_station_id'].isin(
        end_station_ids)]
    stats['throughput'].append({
        'id': 'Total',
        'data': [{'x': datetime.timestamp(summary_datetime)*1000, 'y': event['quantity']} for summary_datetime, event in out_touches_df.iterrows()]
    })
    for pg_id in product_group_ids:
        stats['throughput'].append({
            'id': product_groups[pg_id]['name'] if pg_id in product_groups else '???',
            'data': [{'x': datetime.timestamp(summary_datetime)*1000, 'y': event['quantity']} for summary_datetime, event in out_touches_df[out_touches_df['product_group_id'] == pg_id].iterrows()]
        })

    return stats


def sum_across_dicts(dicts):
    merged = {}
    for d in dicts:
        for key, value in d.items():
            if key in merged:
                merged[key] += value
            else:
                merged[key] = value
    return merged

# ====================================================== #
#           Summary Generator Functions                  #
# ====================================================== #


def generate_process_summaries_until_date(process_id, current_dateTime=None):
    summary = generate_next_process_summary(process_id, current_dateTime)
    while summary is not None:
        # The 'generate_next_summary' function generates a single summary for the day proceeding the last summary.
        # Since this function is called on irregular intervals, keep generating summaries for proceeding days until the current day.
        db.process_summaries.insert_one(summary)
        summary = generate_next_process_summary(process_id, current_dateTime)


def generate_next_process_summary(process_id, current_datetime=None):
    """ Queries the relevant events and returns a summary for all events in that period

    Args:
        station_id (string): ID of station to generate events for
        current_dateTime ([type], optional): [description]. Defaults to None.

    Returns:
        dict: Summary of touch and report events
    """

    if current_datetime is None:
        current_datetime = datetime.now()

    process = db.processes.find_one({'_id': process_id})
    process_station_ids = [node['stationID']
                           for node in process['flattened_stations']]

    # Get latest summary dateTime
    latest_summaries = list(db.process_summaries.find(
        {'process_id': process_id}).sort([("datetime", -1)]).limit(1))
    if len(latest_summaries) == 0:
        first_station_summary_datetime = None
        for station_id in process_station_ids:
            first_summaries = list(db.station_summaries.find(
                {'station_id': station_id}).sort('datetime', 1).limit(1))
            if not len(first_summaries):
                continue
            elif first_station_summary_datetime is None or first_summaries[0]['datetime'] > first_station_summary_datetime:
                first_station_summary_datetime = first_summaries[0]['datetime']
        if first_station_summary_datetime is None:
            return None

        next_summary_start_datetime = datetime.combine(
            first_station_summary_datetime.date(), datetime.min.time())
    else:
        # last_summary_datetime = latest_summaries[-1]['datetime'].date()

        # if last_summary_datetime.weekday() == 4:
        #     # We dont do summaries on weekends
        #     next_summary_start_datetime = latest_summaries[-1]['datetime'] + timedelta(days=3)
        # else:
        next_summary_start_datetime = latest_summaries[-1]['datetime'] + timedelta(
            days=1)

    # Cutoff for next summary is the previous floored summary datetime + the delta
    next_summary_end_datetime = datetime.combine(
        next_summary_start_datetime.date(), datetime.max.time())

    # If last summary was more then the summary period ago, make a new summary
    if current_datetime >= next_summary_end_datetime:

        station_summaries = list(db.station_summaries.find({
            'station_id': {'$in': process_station_ids},
            'datetime': {
                '$gte': next_summary_start_datetime,
                '$lte': next_summary_end_datetime
            }
        }).sort('datetime', 1))
        print('Generating process summary for process "{}" on {} with {} station summaries'.format(
            process['name'], next_summary_start_datetime, len(station_summaries)))

        return summarize_process_events(process, station_summaries, next_summary_start_datetime, next_summary_end_datetime)

    else:   # Otherwise there is no new summary, return None
        print('No summary to be made', current_datetime,
              next_summary_end_datetime)
        return None


def summarize_process_events(process, station_summaries, start_datetime, end_datetime):
    process_summary = {
        'datetime': start_datetime,
        'process_id': process['_id'],
        'map_id': process['map_id'],
        'station_ids': [],
        'routes': [],
        'production_rates': {},
        'throughputs': {},
        'wip': {},
        'working_seconds': 0,
        'cycle_times': {}
    }

    process_routes = list(db.tasks.find({'processId': process['_id']}))
    process_station_ids = [node['stationID']
                           for node in process['flattened_stations']]
    process_stations_nrml = {station['_id']: station for station in db.stations.find(
        {'_id': {'$in': process_station_ids}})}
    process_stations = [process_stations_nrml[station_id]
                        for station_id in process_station_ids]  # Ensures we get the correct order

    process_summary['station_ids'] = process_station_ids
    process_summary['routes'] = [
        {'load': route['load'], 'unload': route['unload']} for route in process_routes]

    # ===== Shift Information
    shift_details = db.settings.find_one()['shiftDetails']
    working_seconds = working_seconds_between_datetimes(
        shift_details, start_datetime, end_datetime)
    process_summary['working_seconds'] = working_seconds

    # ===== Convert everything to dataframes (rows are each summary, columns are pg_ids)
    datetimes_idx = pd.Index([station_summary['datetime']
                             for station_summary in station_summaries])

    summaries_df = pd.DataFrame(station_summaries)
    station_throughput_df = pd.DataFrame.from_dict(
        [station_summary['throughput'] for station_summary in station_summaries]).fillna(0).set_index(datetimes_idx)
    wip_df = pd.DataFrame.from_dict(
        [station_summary['wip'] for station_summary in station_summaries]).fillna(0).set_index(datetimes_idx)

    # ===== Neccessary Database Information ====== #
    product_group_ids = list(set.union(
        set(wip_df.columns.tolist()), set(station_throughput_df.columns.tolist())))
    product_groups = list(db.lot_templates.find(
        {'_id': {'$in': product_group_ids}}))
    # Map to normalized object
    product_groups = {
        product_group['_id']: product_group for product_group in product_groups if product_group['processId'] == process['_id']}
    # Only product groups that are part of that process
    product_group_ids = [product_group['_id']
                         for product_group in product_groups.values()]

    # ===== Store all unload_station_ids that would indicate a lot was finished
    load_station_ids = [route['load'] for route in process_routes]
    unload_station_ids = [route['unload'] for route in process_routes]
    end_station_ids = ['FINISH']
    for unload_station_id in unload_station_ids:
        if unload_station_id not in load_station_ids and process_stations_nrml[unload_station_id]['type'] == 'warehouse':
            end_station_ids.append(unload_station_id)

    outputs = []
    last_summary_date = None
    for station_summary in station_summaries:
        summary_outputs = sum_across_dicts(
            [out_dict for station_id, out_dict in station_summary['out_stations']['data'].items() if station_id in end_station_ids])
        # Multiple finish stations on the same day
        if station_summary['datetime'].date() == last_summary_date:
            outputs[-1] = sum_across_dicts([outputs[-1], summary_outputs])
        else:
            outputs.append(summary_outputs)
        last_summary_date = station_summary['datetime'].date()
    output_df = pd.DataFrame.from_dict(outputs).fillna(
        0).set_index(datetimes_idx.unique())

    # --- Production Rate
    production_rates = {}
    total_throughputs = {}
    total_finished_quantity = 0
    for pg_id in product_group_ids:
        if pg_id in output_df:
            finished_quantity = safe_int(output_df[pg_id].sum())
        else:
            finished_quantity = 0
        total_throughputs[pg_id] = finished_quantity
        production_rates[pg_id] = safe_int(
            safe_divide(working_seconds, finished_quantity))
        total_finished_quantity += finished_quantity

    process_summary['production_rates'] = {
        '__total': safe_int(safe_divide(working_seconds, total_finished_quantity)),
        **production_rates
    }
    process_summary['throughputs'] = {
        '__total': total_finished_quantity,
        **total_throughputs
    }

    # --- WIP
    current_wip = {}
    for station in process_stations:
        latest_station_events = list(db.touch_events.find({'load_station_id': station['_id'], 'product_group_id': {
                                     '$in': product_group_ids}, 'move_datetime': {'$lte': end_datetime}}).sort('_id', -1).limit(1))
        if len(latest_station_events) > 0:
            for pg_id, qty in latest_station_events[0]['current_wip'].items():
                if pg_id in current_wip:
                    current_wip[pg_id] += qty
                else:
                    current_wip[pg_id] = qty

    process_summary['wip'] = {
        '__total': sum([pg_wip for pg_wip in current_wip.values()]),
        **{key: value for key, value in current_wip.items() if key in product_group_ids}
    }

    # --- Cycle Times
    cycle_times = {}
    for station_id in process_station_ids:
        station_cycle_times = {}
        station_cycle_time_df = pd.DataFrame.from_dict([ct_dict for ct_dict in summaries_df[(
            summaries_df['station_id'] == station_id)]['cycle_times']])
        for pg_id in product_group_ids:
            if pg_id in station_cycle_time_df:
                station_cycle_times[pg_id] = safe_int(
                    station_cycle_time_df[pg_id].mean())
        cycle_times[station_id] = station_cycle_times
    process_summary['cycle_times'] = cycle_times

    return process_summary


def generate_process_statistics_from_summaries(summaries, process_id):

    stats = {
        'production_rates': {'total': 0, 'data': []},
        'total_throughputs': {'total': 0, 'data': []},
        'wip': {'total': 0, 'data': []},
        'lead_time': 0,
        'throughput': [],
        'balance': []
    }

    if (len(summaries)) == 0:
        return stats

    shift_details = db.settings.find_one()['shiftDetails']
    daily_working_seconds = calc_daily_working_seconds(shift_details)

    process_station_ids = summaries[-1]['station_ids']
    process_stations_nrml = {station['_id']: station for station in db.stations.find(
        {'_id': {'$in': process_station_ids}})}

    datetimes_idx = pd.Index([summary['datetime'] for summary in summaries])
    max_datetime = summaries[-1]['datetime']

    production_rates_df = pd.DataFrame.from_dict(
        [summary['production_rates'] for summary in summaries]).set_index(datetimes_idx)
    throughputs_df = pd.DataFrame.from_dict(
        [summary['throughputs'] for summary in summaries]).set_index(datetimes_idx)
    wip_df = pd.DataFrame.from_dict(
        [summary['wip'] for summary in summaries]).set_index(datetimes_idx)

    product_group_ids = list(
        set.union(set(wip_df.columns.tolist()), set(throughputs_df.columns.tolist())))
    product_groups = list(db.lot_templates.find(
        {'_id': {'$in': product_group_ids}}))
    # Map to normalized object
    product_groups = {
        product_group['_id']: product_group for product_group in product_groups}

    # --- Production Rates
    for pg_id in production_rates_df:
        # if pg_id not in product_group_ids: continue
        if pg_id == '__total':
            stats['production_rates']['total'] = safe_int(
                production_rates_df[pg_id].mean())
        else:
            stats['production_rates']['data'].append({
                'label': product_groups[pg_id]['name'] if pg_id in product_groups else '???',
                'value': safe_int(production_rates_df[pg_id].mean())
            })

    # --- Throughput
    throughput_data = []
    for pg_id in throughputs_df:
        data = [{
            'x': datetime.timestamp(summary_datetime) * 1000,
            'y': row[pg_id]
        } for summary_datetime, row in throughputs_df.iterrows() if not np.isnan(row[pg_id])]

        if pg_id == '__total':
            throughput_data.append({
                'id': 'Total',
                'data': data
            })
            stats['total_throughputs']['total'] = throughputs_df[pg_id].sum()
        else:
            product_group_name = product_groups[pg_id]['name'] if pg_id in product_groups else '???'
            throughput_data.append({
                'id': product_group_name,
                'data': data
            })
            stats['total_throughputs']['data'].append({
                'label': product_groups[pg_id]['name'] if pg_id in product_groups else '???',
                'value': throughputs_df[pg_id].sum()
            })
    stats['throughput'] = throughput_data

    # --- WIP
    for pg_id in wip_df:
        # if pg_id not in product_group_ids: continue
        if pg_id == '__total':
            stats['wip']['total'] = safe_int(wip_df[pg_id].mean())
        else:
            stats['wip']['data'].append({
                'label': product_groups[pg_id]['name'] if pg_id in product_groups else '???',
                'value': safe_int(wip_df[pg_id].mean())
            })

    # --- Lead Time
    stats['lead_time'] = stats['production_rates']['total'] * stats['wip']['total'] * 86400 / \
        daily_working_seconds  # The ratio of how much of the day (86400 seconds) is working seconds

    balance = {}
    for station_id in process_station_ids:
        station_cycle_time_df = pd.DataFrame.from_dict(
            [summary['cycle_times'][station_id] for summary in summaries if station_id in summary['cycle_times']])
        station = process_stations_nrml[station_id] if station_id in process_stations_nrml else None
        for pg_id in product_group_ids:
            if pg_id not in product_group_ids:
                continue
            if pg_id == '__total':
                continue

            if pg_id not in station_cycle_time_df:
                latest_pg_station_event = list(db.touch_events.find({'product_group_id': pg_id, 'load_station_id': station_id, 'move_datetime': {
                                               '$lte': max_datetime}}).sort('move_datetime', -1).limit(1))
                if len(latest_pg_station_event) > 0:
                    most_recent_cycle_time = latest_pg_station_event[0]['pgs_cycle_time']
                else:
                    most_recent_cycle_time = 0

                bar = {
                    'Station': station['name'] if station is not None else '???',
                    'Cycle Time': most_recent_cycle_time
                }
            else:
                bar = {
                    'Station': station['name'] if station is not None else '???',
                    'Cycle Time': station_cycle_time_df[pg_id].mean()
                }

            if pg_id in balance:
                balance[pg_id].append(bar)
            else:
                balance[pg_id] = [bar]
    stats['balance'] = balance

    return stats


# ================================================== #

def calculate_process_production_rate(process_id):

    process = db.processes.find_one({'_id': process_id})
    process_station_ids = [node['stationID']
                           for node in process['flattened_stations']]
    process_routes = list(db.tasks.find({'_id': {'$in': process['routes']}}))
    process_stations_nrml = {station['_id']: station for station in db.stations.find(
        {'_id': {'$in': process_station_ids}})}

    # ===== Store all unload_station_ids that would indicate a lot was finished
    load_station_ids = [route['load'] for route in process_routes]
    unload_station_ids = [route['unload'] for route in process_routes]

    end_station_ids = ['FINISH']
    for unload_station_id in unload_station_ids:
        if unload_station_id not in load_station_ids and process_stations_nrml[unload_station_id]['type'] == 'warehouse':
            end_station_ids.append(unload_station_id)

    events = list(db.touch_events.find({'unload_station_id': {'$in': end_station_ids}}).sort(
        'move_datetime').sort('move_datetime', -1).limit(30))
    if len(events) == 0:
        return 0
    events_df = pd.DataFrame(events)

    # ===== Shift Information for total working time
    shift_details = db.settings.find_one()['shiftDetails']

    first_event_time = events_df.iloc[0]['move_datetime']
    last_event_time = events_df.iloc[-1]['move_datetime']

    total_working_seconds = working_seconds_between_datetimes(
        shift_details, first_event_time, last_event_time)

    # Since we use the first events move time to start the timer, dont include it's quantity
    total_finished_qty = safe_int(events_df['quantity'][1:].sum())
    production_rate = safe_int(safe_divide(
        total_working_seconds, total_finished_qty))

    return production_rate
