import simplejson as json
from pymongo import MongoClient
import numpy as np
from pprint import pprint
import pandas as pd
from datetime import date, datetime, timedelta
import time

client = MongoClient('localhost:27017')
db = client.ContactDB
 
def delete_all_station_summaries():
    db.station_summaries.delete_many({})
    
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

def generate_station_statistics(station_id, start_date, end_date=None):
    """Called by the API to generate either a single-day summary or a multi-day summary

    Args:
        station_id (str): ID of the station to generate statistics for
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
        
        touch_events = list(db.touch_events.find({
            'load_station_id': station_id, 
            'move_datetime': {
                '$gte': min_datetime,
                '$lte': max_datetime
            }
        }).sort('move_datetime', 1))
        
        report_events = list(db.report_events.find({
            'station_id': station_id, 
            'datetime': {
                '$gte': min_datetime,
                '$lte': max_datetime
            }
        }).sort('datetime', 1))
        
        print('Generating stats from {} touch events and {} report events ({})'.format(len(touch_events), len(report_events), min_datetime.date()))
        stats = generate_station_statistics_from_events(station_id, touch_events, report_events, start_date)
        return json.dumps(stats, ignore_nan=True, default=serializeDayStats)

    else:
        generate_station_summaries_until_date(station_id)
        
        start_date = datetime.fromtimestamp(start_date/1000)
        end_date = datetime.fromtimestamp(end_date/1000)
        
        # This is a multi day query, generate stats based on summaries
        min_datetime = datetime.combine(start_date, datetime.min.time())
        max_datetime = datetime.combine(end_date, datetime.max.time())    
        
        summaries = list(db.station_summaries.find({
            'station_id': station_id, 
            'datetime': {
                '$gte': min_datetime,
                '$lte': max_datetime
            }
        }).sort('datetime', 1))
        
        if end_date.date() == datetime.now().date():
            print("TEMP SUMMARY FOR ", end_date.date())
            
            temp_summary_start = datetime.combine(end_date, datetime.min.time())
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
            }).sort('datetime', 1))
            station = db.stations.find_one({'_id': station_id})
            
            new_temp_summary = summarize_station_events(touch_events, report_events, station, temp_summary_start)
            summaries.append(new_temp_summary)
            
        
        print('Generating stats from {} summaries ({} -> {})'.format(len(summaries), min_datetime.date(), max_datetime.date()))
        stats = generate_station_statistics_from_summaries(station_id, summaries)
        return json.dumps(stats, ignore_nan=True, default=serializeMultiDayStats)

# ===================================================== #
#           Generate Statistics from Events             #
# ===================================================== #

def bin_wip_to_lines_data(initial_wip, df, bins, product_groups):

    cut_data = pd.cut(df.index, bins)
    grouped_data = list(df.groupby(cut_data)['current_wip'])

    wip_data_dict = {}
    for pg in product_groups:
        wip_data_dict[pg['_id']] = {
            'id': pg['name'],
            'data': []
        }
        
    last_wip_values_df = pd.DataFrame.from_dict([initial_wip]) # If there are no events in a bin, we will default to the last known wip values
    for bin_data in grouped_data:
                        
        values_df = pd.DataFrame(bin_data[1].values.tolist())
        
        if len(values_df.index) == 0:
            values_df = last_wip_values_df
        
        mean_wip = {key: values_df[key].mean() for key in values_df.columns}
        
        for pg in product_groups:
            if pg['_id'] in mean_wip:
                wip_data_dict[pg['_id']]['data'].append({'x': datetime.timestamp(bin_data[0].right)*1000, 'y': mean_wip[pg['_id']]})
            else:
                wip_data_dict[pg['_id']]['data'].append({'x': datetime.timestamp(bin_data[0].right)*1000, 'y': 0})
                
        last_wip_values_df = values_df
            
    return list(wip_data_dict.values())

def product_group_pie(df, product_groups, processes):
    grouped_df = list(df.groupby('product_group_id'))
    
    pg_pie = []
    for pg_id, pg_df in grouped_df:
        product_group_name = product_groups[pg_id]['name'] if pg_id in product_groups else '???'
        product_group_process_name = processes[product_groups[pg_id]['processId']]['name'] if (pg_id in product_groups and product_groups[pg_id]['processId'] in processes) else '???'
        
        pg_pie.append({
            'id': '{} ({})'.format(product_group_name, product_group_process_name),
            'label': product_groups[pg_id]['name'],
            'value': pg_df['quantity'].sum()
        })
        
    return pg_pie

def process_pie(df, processes):
    grouped_df = list(df.groupby('process_id'))
    
    process_pie = []
    for process_id, process_df in grouped_df:
        process_pie.append({
            'id': processes[process_id]['name'] if process_id in processes else '???',
            'label': processes[process_id]['name'] if process_id in processes else '???',
            'value': process_df['quantity'].sum()
        })
        
    return process_pie

def out_station_pie(df, stations):
    grouped_df = list(df.groupby('unload_station_id'))
    
    out_station_pie = []
    for out_station_id, out_station_df in grouped_df:
        
        if out_station_id == 'FINISH':
            label = 'FINISH'
        elif out_station_id in stations:
            label = stations[out_station_id]['name']
        else:
            label = '???'
        
        out_station_pie.append({
            'id': label,
            'label': label,
            'value': out_station_df['quantity'].sum()
        })
        
    return out_station_pie

def operators_pie(df):
    grouped_df = list(df.groupby('operator'))
    
    operator_pie = []
    for operator_name, operator_df in grouped_df:
        operator_pie.append({
            'id': operator_name,
            'label': operator_name,
            'value': operator_df['quantity'].sum()
        })
        
    return operator_pie

def bin_reports_to_bar_data(df, bins):
    # Bin data
    cut_data = pd.cut(df['datetime'], bins)
    binned_data = list(df.groupby(cut_data))
    
    bar_data = []
    for data in binned_data:
        bar = {
            "x": data[0].right # X value is the timestep to the right of the bin
        }
        # Organize the reports by name, and set the bar to the count of instances of that report
        value_counts = data[1]['report_name'].value_counts().to_dict()
        for key, value in value_counts.items():
            bar[key] = value
            
        bar_data.append(bar)

    return bar_data

def reports_pie(df, colors):
    report_counts = df['report_name'].value_counts().to_dict()
    
    report_pie = []
    for report_name, count in report_counts.items():
        report_pie.append({
            "id": report_name,
            "label": report_name, 
            "value": count,
            "color": colors[report_name]
        })
        
    return report_pie

def machine_utilization(df, total_seconds):
    working_seconds = df['working_seconds'].sum()
    return {
        'id': '',
        'working': safe_int(working_seconds),
        'idle': safe_int(total_seconds - working_seconds)
    }
    
def value_creating_time(df):
    df = df[df['load_station_id'] != 'QUEUE']
    ave_working = df['working_seconds'].mean()
    ave_idle = df['idle_seconds'].mean()
    
    return {
        'id': '',
        'working': safe_int(ave_working),
        'idle': safe_int(ave_idle)
    }
    
    
def shift_on_date(date, shift_start_time, shift_end_time):
    start = date.replace(hour=shift_start_time.hour, minute=shift_start_time.minute, second=0, microsecond=0)
    end = date.replace(hour=shift_end_time.hour, minute=shift_end_time.hour, second=0, microsecond=0)
    return [start, end]

def generate_station_statistics_from_events(station_id, touch_events, report_events, start_date):
    
    stats = {
        'total_quantity': 0,
        'partials': {},
        'cycle_time': {},
        'throughput': [],
        'wip': [],
        'product_group_pie': [],
        'process_pie': [],
        'out_station_pie': [],
        'operator_pie': [],
        'machine_utilization': [],
        'value_creating_time': [],
        'reports': [],
        'reports_pie': [],
        'daily_working_seconds': 0
    }
    
    te_count = len(touch_events)
    re_count = len(report_events)
    
    station = db.stations.find_one({'_id': station_id})
    
    # ===== Shift Information
    shift_details = db.settings.find_one()['shiftDetails']
    shift_start_time = datetime.strptime(shift_details['startOfShift'],'%H:%M')
    shift_end_time = datetime.strptime(shift_details['endOfShift'],'%H:%M')
    
    [day_start, day_end] = shift_on_date(start_date, shift_start_time, shift_end_time)
    working_seconds = calc_daily_working_seconds(shift_details)
    stats['daily_working_seconds'] = working_seconds
    
    if te_count > 0:
        day_start = min(day_start, touch_events[0]['move_datetime'])
        day_end = max(day_end, touch_events[-1]['move_datetime'])
    if re_count > 0:
        day_start = min(day_start, report_events[0]['datetime'])
        day_end = max(day_end, report_events[-1]['datetime'])
    
    # === Generate bins
    start_hour = round_time(day_start, timedelta(hours=1), 'floor')
    end_hour = round_time(day_end, timedelta(hours=1), 'ceil') - timedelta(seconds=1)
    delta_hours = 1 + ((end_hour - start_hour).seconds // 3600)
    
    bins = [start_hour]
    for delta_hour in range(delta_hours):
        bins.append(start_hour + timedelta(hours=delta_hour+1))
    
    if te_count > 0:
        touches_df = pd.DataFrame(touch_events).set_index('move_datetime')   
            
        product_group_ids = list(touches_df['product_group_id'].unique())
        product_groups = list(db.lot_templates.find({'_id': {'$in': product_group_ids}}))
        product_groups = {product_group['_id']: product_group for product_group in product_groups} # Map to normalized object
        
        processes = list(db.processes.find({'map_id': station['map_id']}))
        processes = {process['_id']: process for process in processes} # Map to normalized object
        
        stations = list(db.stations.find({'map_id': station['map_id']}))
        stations = {station['_id']: station for station in stations} # Map to normalized object
        
    
        pg_grouped_data = touches_df.groupby(['product_group_id'])
        total_qty = 0
        for pg_id, grouped_events in pg_grouped_data:
            
            pg_qty = safe_int(grouped_events['quantity'].sum())
            total_qty += pg_qty
            pgs_events_count = len(grouped_events.index)
            pgs_ct_sum = grouped_events['pgs_cycle_time'].sum()
            
            # Average OEE and Prod over the day 
            # NOTE: We dont actually calculate OEE here. We leave out the theoretical cycle time because we calculate
            # that on the fly on the frontend. Here we just organize it by pg_ids
            stats['partials'][pg_id] = {'value': (pgs_events_count / pgs_ct_sum), 'quantity': pg_qty}
            # stats['partials'][pg_id] = {'value': (1 / grouped_events['pgs_cycle_time'][-1]), 'quantity': pg_qty}
        
        stats['total_quantity'] = total_qty
        
        found_pg_ids = []
        for touch_event in touch_events[::-1]: # Reverse order because we want to take the stats at the end of the day
            pg_id = touch_event['product_group_id']
            
            if pg_id not in product_group_ids:
                continue
                    
            # First time weve found this product group, this is the latest data we have
            if pg_id not in found_pg_ids:
                found_pg_ids.append(pg_id)
                
                product_group_name = product_groups[pg_id]['name']
                product_group_process_name = processes[product_groups[pg_id]['processId']]['name'] if (product_groups[pg_id]['processId'] in processes) else '???'
                
                # --- Cycle Time
                stats['cycle_time'][pg_id] = {
                    'name': '{} ({})'.format(product_group_name, product_group_process_name),
                    'current': touch_event['pgs_cycle_time'],
                    'line_data': [{
                        'id': '{} ({})'.format(product_group_name, product_group_process_name),
                        'data': [{
                            'x': datetime.timestamp(touch_event['move_datetime'])*1000,
                            'y': touch_event['pgs_cycle_time']
                        }]
                    }]
                }
                
            else:
                # --- Cycle Time
                # There is already data for this product group, insert it at beginnning (since we are going through events in reverse order)
                stats['cycle_time'][pg_id]['line_data'][0]['data'].insert(0, {
                    'x': datetime.timestamp(touch_event['move_datetime'])*1000,
                    'y': touch_event['pgs_cycle_time']
                })
                
        for pg_id, data in stats['cycle_time'].items():
            ave = np.mean([datapoint['y'] for datapoint in data['line_data'][0]['data']])
            stats['cycle_time'][pg_id]['average'] = ave
    
    
        # --- Throughput
        stats['throughput'].append({
            'id': 'Total',
            'data': [{'x': datetime.timestamp(summary_datetime)*1000, 'y': event['quantity']} for summary_datetime, event in touches_df.iterrows()]
        })
        for pg_id in product_group_ids:
            product_group_name = product_groups[pg_id]['name']
            product_group_process_name = processes[product_groups[pg_id]['processId']]['name'] if (product_groups[pg_id]['processId'] in processes) else '???'
                
            stats['throughput'].append({
                'id': '{} ({})'.format(product_group_name, product_group_process_name),
                'data': [{'x': datetime.timestamp(summary_datetime)*1000, 'y': event['quantity']} for summary_datetime, event in touches_df[touches_df['product_group_id'] == pg_id].iterrows()]
            })
            
        # --- WIP
        initial_wip_events = list(db.touch_events.find({
            'load_station_id': station_id, 
            'move_datetime': { '$lte': start_date }
        }).sort('move_datetime', -1).limit(1))
        initial_wip = initial_wip_events[0]['current_wip'] if len(initial_wip_events) else {}
        
        stats['wip'] = bin_wip_to_lines_data(initial_wip, touches_df, bins, product_groups.values())
        
        # --- Product Group Pie
        stats['product_group_pie'] = product_group_pie(touches_df, product_groups, processes)
        
        # --- Process Pie
        stats['process_pie'] = process_pie(touches_df, processes)
        
        # --- Out Station Pie
        stats['out_station_pie'] = out_station_pie(touches_df, stations)
        
        # --- Operator Pie
        stats['operator_pie'] = operators_pie(touches_df)
        
        # --- Machine Utilization
        stats['machine_utilization'] = machine_utilization(touches_df, working_seconds)
        
        # --- Value Creating Time
        stats['value_creating_time'] = value_creating_time(touches_df)
        
    if re_count > 0:
        # === Reports
        # Instead of querying the dashboards every time, fill in the dataframe with report name and report color
        dashboard = db.dashboards.find_one({'station': station_id})
        
        report_buttons_normalized = {x['_id']: x for x in dashboard['report_buttons']} if 'report_buttons' in dashboard else None

        reports_colors = {} # Also store a dictionary of all colors, with the key being the report name
        for i, re in enumerate(report_events):
            rb_id = re['report_button_id']
            if rb_id in report_buttons_normalized:
                report_name = report_buttons_normalized[rb_id]['label'] if report_buttons_normalized is not None else '???'
                report_events[i]['report_name'] = report_name
                reports_colors[report_name] = report_buttons_normalized[rb_id]['color'] if report_buttons_normalized is not None else '#{}'.format(str(np.random.randint(0,10))*6) # Random grey color if dashboard doesnt exist

        # Convert to dataframe
        reports_df = pd.DataFrame(report_events)

        # --- Reports Bar
        stats['reports'] = {
            'key_colors': reports_colors,
            'data': bin_reports_to_bar_data(reports_df, bins)
        }
        
        # --- Reports Pie
        stats['reports_pie'] = reports_pie(reports_df, reports_colors)
            
    return stats

# ====================================================== #
#           Summary Generator Functions                  #
# ====================================================== #
def generate_station_summaries_until_date(station_id, current_dateTime=None):
    summary = generate_next_station_summary(station_id, current_dateTime)
    while summary is not None:
        # The 'generate_next_summary' function generates a single summary for the day proceeding the last summary.
        # Since this function is called on irregular intervals, keep generating summaries for proceeding days until the current day.
        db.station_summaries.insert_one(summary)
        summary = generate_next_station_summary(station_id, current_dateTime)
        
def generate_next_station_summary(station_id, current_datetime=None):
    """ Queries the relevant events and returns a summary for all events in that period

    Args:
        station_id (string): ID of station to generate events for
        current_dateTime ([type], optional): [description]. Defaults to None.

    Returns:
        dict: Summary of touch and report events
    """
    
    if current_datetime is None:
        current_datetime = datetime.now()
        
    # Get latest summary dateTime
    latest_summaries = list(db.station_summaries.find({'station_id': station_id}).sort([("datetime",-1)]).limit(1))
    if len(latest_summaries) == 0:
        # No current summary entries, use first event as latest datetime
        first_touch_events = list(db.touch_events.find({'load_station_id': station_id, 'move_datetime': {'$ne': None}}).sort([("move_datetime",1)]).limit(1))
        first_report_events = list(db.report_events.find({'station_id': station_id}).sort([("datetime",1)]).limit(1))

        # Take the earlies touch or report event datetime
        if len(first_touch_events): 
            first_event_datetime = first_touch_events[-1]['move_datetime']
            if len(first_report_events):
                first_event_datetime = min(first_event_datetime, first_report_events[-1]['datetime'])
        elif len(first_report_events): 
            first_event_datetime = first_report_events[-1]['datetime']
        else:
            return
                        
        next_summary_start_datetime = datetime.combine(first_event_datetime.date(), datetime.min.time())
    else:
        # last_summary_datetime = latest_summaries[-1]['datetime'].date()
        
        # if last_summary_datetime.weekday() == 4:
        #     # We dont do summaries on weekends
        #     next_summary_start_datetime = latest_summaries[-1]['datetime'] + timedelta(days=3)
        # else:
        next_summary_start_datetime = latest_summaries[-1]['datetime'] + timedelta(days=1)
        
    # Cutoff for next summary is the previous floored summary datetime + the delta
    next_summary_end_datetime = datetime.combine(next_summary_start_datetime.date(), datetime.max.time())
            
    if current_datetime >= next_summary_end_datetime:  # If last summary was more then the summary period ago, make a new summary

        ## Time to generate new summary
        # Gets all events in the summary period (touch and report)
        next_touch_events = list(db.touch_events.find({
            '$and': [
                {'load_station_id': station_id},
                {'move_datetime': {'$gt': next_summary_start_datetime}},
                {'move_datetime': {'$lte': next_summary_end_datetime}}
            ]
        }).sort('_id', 1))
        
        next_report_events = list(db.report_events.find({
            '$and': [
                {'station_id': station_id},
                {'datetime': {'$gt': next_summary_start_datetime}},
                {'datetime': {'$lte': next_summary_end_datetime}}
            ]
        }).sort('_id', 1))

        # Return the summarized events
        station = db.stations.find_one({'_id': station_id})
        print('Generating station summary for station "{}" on {}'.format(station['name'], next_summary_start_datetime))
        
        return summarize_station_events(next_touch_events, next_report_events, station, next_summary_start_datetime)

    else:   # Otherwise there is no new summary, return None
        return None
    
def safe_int(x):
    if np.isnan(x) or np.isinf(x): return np.NaN
    return int(round(x))

def safe_divide(x, y):
    if y == 0: return 0
    try:
        return x / y
    except ZeroDivisionError:
        return 0

def summarize_station_events(touch_events, report_events, station, summary_datetime):
    touches_df = pd.DataFrame(touch_events)
    reports_df = pd.DataFrame(report_events)
    
    summary = {
        'datetime': summary_datetime,
        'station_id': station['_id'],
        'map_id': station['map_id'],
        'total_events': 0,
        'cycle_times': {},
        'pgs_count_over_ct': {},
        'productivity': {},
        'oee': {},
        'throughput': {},
        'wip': {},
        'reports': {},
        'product_groups': {},
        'processes': {},
        'out_stations': {
            'totals': {},
            'data': {}  
        },
        'operators': {},
        'total_working_seconds': 0,
        'total_seconds': 0,
        'mean_working_seconds': 0,
        'mean_idle_seconds': 0
    }
    
    if len(touch_events):
        summary['total_events'] = len(touch_events)
        
        pg_grouped_data = touches_df.groupby(['product_group_id'])
        lastest_pg_events = touches_df.drop_duplicates('product_group_id', keep='last')
        
        # --- Cycle Time: For each product group, take the CT for the last event of the day
        summary['cycle_times'] = {
            pg_id: cycle_time
            for pg_id, cycle_time
            in zip(lastest_pg_events['product_group_id'], lastest_pg_events['pgs_cycle_time'])
        }
        
        pgs_count_over_ct = {}
        # productivity = {}
        # oee = {}
        throughput = {}
        pg_pie = {}
        qtys = {}
        
        for pg_id, grouped_events in pg_grouped_data:
            
            pgs_events_count = len(grouped_events.index)
            pgs_ct_sum = grouped_events['pgs_cycle_time'].sum()
            
            qtys[pg_id] = safe_int(grouped_events['quantity'].sum())
            
            # --- pgs_count_over_ct: The ratio of number of events over the summation of all event cycle times can be used
            # to calculate both productivity and oee later when the summaries are compiled into statistics. This way we can take
            # into account the most recent taxt time and theoretical min cycle time
            pgs_count_over_ct[pg_id] = safe_divide(pgs_events_count, pgs_ct_sum)
            
            # --- Throughput: Take the summation of throughput for each product group throughout the day
            throughput[pg_id] = safe_int(grouped_events['quantity'].sum())
            
            # --- Product Group Pie: Total quantity for that product group
            pg_pie[pg_id] = safe_int(grouped_events['quantity'].sum())

        summary['pgs_count_over_ct'] = pgs_count_over_ct
        # summary['productivity'] = productivity
        # summary['oee'] = oee
        summary['throughput'] = throughput
        summary['product_groups'] = pg_pie
                
        # --- Process Pie: total quantity through each process
        process_pie = {}
        for process_id, grouped_events in touches_df.groupby(['process_id']):
            process_pie[process_id] = safe_int(grouped_events['quantity'].sum())
        summary['processes'] = process_pie
        
        # --- Out station Pie: Total quantity to each station
        out_stations = {}
        for unload_station_id, grouped_station_events in touches_df.groupby(['unload_station_id']):
            out_stations[unload_station_id] = {}
            for pg_id, grouped_pg_events in grouped_station_events.groupby(['product_group_id']):
                out_stations[unload_station_id][pg_id] = safe_int(grouped_pg_events['quantity'].sum())
        summary['out_stations'] = {
            'totals': {out_station_id: sum(out_station_pg_dict.values()) for out_station_id, out_station_pg_dict in out_stations.items()},
            'data': out_stations
        }
        
        operator_pie = {}
        for operator_name, grouped_events in touches_df.groupby(['operator']):
            operator_pie[operator_name] = safe_int(grouped_events['quantity'].sum())
        summary['operators'] = operator_pie

        # --- WIP: Take the mean WIP durring the day
        values_df = pd.DataFrame(touches_df['current_wip'].values.tolist())
        wip = {key: safe_int(values_df[key].mean()) for key in values_df.columns}
        
        summary['wip'] = wip
        
        # --- Value Creating Time / Machine Util: Store the total working seconds and total idle seconds
        # ===== Shift Information
        shift_details = db.settings.find_one()['shiftDetails']
        working_seconds = calc_daily_working_seconds(shift_details)
            
        summary['total_working_seconds'] = safe_int(touches_df['working_seconds'].sum())
        summary['total_seconds'] = working_seconds
        summary['mean_working_seconds'] = safe_int((touches_df['working_seconds'] / touches_df['quantity']).mean())
        summary['mean_idle_seconds'] = safe_int((touches_df['idle_seconds']).sum())
                
    if len(report_events):
        summary['reports'] = reports_df['report_button_id'].value_counts().to_dict()
    
    
    return summary

def generate_station_statistics_from_summaries(station_id, summaries):
    stats = {
        'total_quantity': 0,
        'partials': {},
        'cycle_time': {},
        'throughput': [],
        'wip': [],
        'product_group_pie': [],
        'process_pie': [],
        'out_station_pie': [],
        'opeartor_pie': [],
        'machine_utilization': [],
        'value_creating_time': [],
        'reports': [],
        'reports_pie': [],
        'daily_working_seconds': 0
    }
    
    if len(summaries) < 2:
        print('Not Enought Data')
        return stats
    
    days = (summaries[-1]['datetime'] - summaries[0]['datetime']).days
    
    # ===== Shift Information
    shift_details = db.settings.find_one()['shiftDetails']
    working_seconds = calc_daily_working_seconds(shift_details)
    stats['daily_working_seconds'] = working_seconds
    
    # ===== Convert everything to dataframes (rows are each summary, columns are pg_ids)
    datetimes_idx = pd.Index([summary['datetime'] for summary in summaries])
    
    pgs_count_over_ct_df = pd.DataFrame.from_dict([summary['pgs_count_over_ct'] for summary in summaries])
    # prod_df = pd.DataFrame.from_dict([summary['productivity'] for summary in summaries]).fillna(0)
    # oee_df = pd.DataFrame.from_dict([summary['oee'] for summary in summaries]).fillna(0)
    cycle_time_df = pd.DataFrame.from_dict([summary['cycle_times'] for summary in summaries]).set_index(datetimes_idx)
    throughput_df = pd.DataFrame.from_dict([summary['throughput'] for summary in summaries]).fillna(0).set_index(datetimes_idx)
    reports_df = pd.DataFrame.from_dict([summary['reports'] for summary in summaries])
    wip_df = pd.DataFrame.from_dict([summary['wip'] for summary in summaries]).fillna(0).set_index(datetimes_idx)
    processes_df = pd.DataFrame.from_dict([summary['processes'] for summary in summaries])
    product_groups_df = pd.DataFrame.from_dict([summary['product_groups'] for summary in summaries])
    out_stations_df = pd.DataFrame.from_dict([summary['out_stations']['totals'] for summary in summaries])
    operators_df = pd.DataFrame.from_dict([summary['operators'] for summary in summaries])
       
    # Dict with key=product group ID and value is the total quantity moved for that pg
    total_quantities = {pg_id: throughput_df[pg_id].sum() for pg_id in throughput_df}
    
    # ===== Neccessary DB data
    station = db.stations.find_one({'_id': station_id})
    dashboard = db.dashboards.find_one({'station': station_id})
    
    product_group_ids = list(set.union(set(wip_df.columns.tolist()), set(throughput_df.columns.tolist())))
    product_groups = list(db.lot_templates.find({'_id': {'$in': product_group_ids}}))
    product_groups = {product_group['_id']: product_group for product_group in product_groups} # Map to normalized object
    
    processes = list(db.processes.find({'map_id': station['map_id']}))
    processes = {process['_id']: process for process in processes} # Map to normalized object
    
    stations = list(db.stations.find({'map_id': station['map_id']}))
    stations = {station['_id']: station for station in stations} # Map to normalized object
                
    # ===== Start Calculations
    partials = {}
    for pg_id in pgs_count_over_ct_df:
        
        if pg_id not in product_groups:
            continue
        
        partials[pg_id] = {'value': pgs_count_over_ct_df[pg_id].mean(), 'quantity': total_quantities[pg_id]}
        
    stats['partials'] = partials
    stats['total_quantity'] = sum(total_quantities.values())

    # --- Cycle Time, Throughput, WIP
    cycle_time_data = {}
    throughput_data = []
            
    for pg_id in cycle_time_df:
        if pg_id not in product_groups:
            continue
        
        cycle_time_data[pg_id] = {
            'name': product_groups[pg_id]['name'],
            'current': [ct for ct in cycle_time_df[pg_id] if not np.isnan(ct)][-1],
            'average': np.mean([row[pg_id] for summary_datetime, row in cycle_time_df.iterrows() if not np.isnan(row[pg_id])]),
            'line_data': [{
                'id': product_groups[pg_id]['name'],
                'data': [{
                    'x': datetime.timestamp(summary_datetime)*1000,
                    'y': row[pg_id]
                } for summary_datetime, row in cycle_time_df.iterrows() if not np.isnan(row[pg_id])]
            }]
        }
    
    for pg_id in throughput_df:
        product_group_name = product_groups[pg_id]['name'] if pg_id in product_groups else '???'
        product_group_process_name = processes[product_groups[pg_id]['processId']]['name'] if (pg_id in product_groups and product_groups[pg_id]['processId'] in processes) else '???'

        throughput_data.append({
            'id': '{} ({})'.format(product_group_name, product_group_process_name),
            'data': [{
                    'x': datetime.timestamp(summary_datetime)*1000,
                    'y': row[pg_id]
                } for summary_datetime, row in throughput_df.iterrows() if not np.isnan(row[pg_id])]
        })
    
    wip_data = {}
    last_summary_wip = None
    for summary in summaries:
        if summary['total_events'] == 0:
            if last_summary_wip is None: # Must have an initial wip value. If the first summary doesnt have any events, then take the last summary before it that has events
                last_summary_wip_summaries = list(db.station_summaries.find({
                    'station_id': station_id, 
                    'total_events': {'$gt': 0}, 
                    'datetime': {'$lt': summaries[0]['datetime']}
                }).sort('datetime', 1).limit(1))
                last_summary_wip = last_summary_wip_summaries[0]['wip'] if len(last_summary_wip_summaries) else {}
            summary_wip = last_summary_wip
        else:
            summary_wip = summary['wip']
            
        for pg_id in summary_wip.keys():
            if pg_id in wip_data:
                wip_data[pg_id].append({
                    'x': datetime.timestamp(summary['datetime'])*1000,
                    'y': summary_wip[pg_id]
                })
            else: 
                wip_data[pg_id] = [{
                    'x': datetime.timestamp(summary['datetime'])*1000,
                    'y': summary_wip[pg_id]
                }]
                
    for pg_id, data in wip_data.items():
        product_group_name = product_groups[pg_id]['name'] if pg_id in product_groups else '???'
        product_group_process_name = processes[product_groups[pg_id]['processId']]['name'] if (pg_id in product_groups and product_groups[pg_id]['processId'] in processes) else '???'

        stats['wip'].append({
            'id': '{} ({})'.format(product_group_name, product_group_process_name),
            'data': data
        })        
    
    # --- Total Throughput
    throughput_data.append({
        'id': 'Total',
        'data': [{
            'x': datetime.timestamp(summary_datetime)*1000,
            'y': row.sum()
        } for summary_datetime, row in throughput_df.iterrows()]
    })
    
    stats['cycle_time'] = cycle_time_data
    stats['throughput'] = throughput_data
        
    # --- Process Pie
    stats['process_pie'] = [{
        'id': processes[process_id]['name'] if process_id in processes else '???',
        'label': processes[process_id]['name'] if process_id in processes else '???',
        'value': processes_df[process_id].sum()
    } for process_id in processes_df]
    
    # --- Product Group Pie
    stats['product_group_pie'] = [{
        'id': '{} ({})'.format(product_groups[pg_id]['name'] if pg_id in product_groups else '???', processes[product_groups[pg_id]['processId']]['name'] if (pg_id in product_groups and product_groups[pg_id]['processId'] in processes) else '???'),
        'label': '{} ({})'.format(product_groups[pg_id]['name'] if pg_id in product_groups else '???', processes[product_groups[pg_id]['processId']]['name'] if (pg_id in product_groups and product_groups[pg_id]['processId'] in processes) else '???'),
        'value': product_groups_df[pg_id].sum()
    } for pg_id in product_groups_df]
    
    # --- Out Station Pie
    stats['out_station_pie'] = [{
        'id': (stations[out_station_id]['name'] if out_station_id in stations else '???') if out_station_id != 'FINISH' else 'FINISH',
        'label': (stations[out_station_id]['name'] if out_station_id in stations else '???') if out_station_id != 'FINISH' else 'FINISH',
        'value': out_stations_df[out_station_id].sum()
    } for out_station_id in out_stations_df]
    
    # --- Operator Pie
    stats['operator_pie'] = [{
        'id': operator_name,
        'label': operator_name,
        'value': operators_df[operator_name].sum()
    } for operator_name in operators_df]
    
    if 'report_buttons' in dashboard:
        report_buttons_normalized = {x['_id']: x for x in dashboard['report_buttons']}
        
        # --- Reports Pie
        stats['reports_pie'] = [{
            'id': report_buttons_normalized[report_button_id]['label'] if report_button_id in report_buttons_normalized else '???',
            'label': report_buttons_normalized[report_button_id]['label'] if report_button_id in report_buttons_normalized else '???',
            'value': reports_df[report_button_id].sum(),
            'color': report_buttons_normalized[report_button_id]['color'] if report_button_id in report_buttons_normalized else str(np.random.randint(0,10))*6 # If no button color, assign to random grey
        } for report_button_id in reports_df]
        
        # --- Reports Bars
        # We bin report data when neccessary because we cant fit 300 bars on a single graph. We just accept a maximum of 20 bars and we bin them if the summary period is more than 20 days
        reports_data = []
        current_bar_data = {}
        reports_colors = {}
        days = len(summaries)
        num_items_per_bin = np.ceil(days / 20)
        for i, summary in enumerate(summaries):
            current_bar_data = {}
            for rb_id, num_reports in summary['reports'].items():
                report_name = report_buttons_normalized[rb_id]['label'] if report_buttons_normalized is not None else '???'
                
                if report_name not in reports_colors: # Colors of each bar are tied to the name of the report
                    reports_colors[report_name] = report_buttons_normalized[rb_id]['color'] if report_buttons_normalized is not None else '#{}'.format(str(np.random.randint(0,10))*6) # Random grey color if dashboard doesnt exist

                if report_name in current_bar_data:
                    current_bar_data[report_name] += num_reports
                else:
                    current_bar_data[report_name] = num_reports
                    
            if (i+1) % num_items_per_bin == 0:
                reports_data.append({
                    'x': summary['datetime'],
                    **current_bar_data
                })
            
        stats['reports'] = {
            'key_colors': reports_colors,
            'data': reports_data
        }
    
    # --- Value Creating Time
    stats['value_creating_time'] = {
        'id': '',
        'working': sum([summary['mean_working_seconds'] for summary in summaries]),
        'idle': sum([summary['mean_idle_seconds'] for summary in summaries])
    }
    
    # --- Machine Utilization
    machine_working_seconds = sum([summary['total_working_seconds'] for summary in summaries])
    stats['machine_utilization'] = {
        'id': '',
        'working': machine_working_seconds,
        'idle': days*sum([summary['total_seconds'] for summary in summaries]) - machine_working_seconds
    }

    return stats

# ===================================================== #
#                Cycle Time Calculation                 #
# ===================================================== #

def aggregate(query, limit=None):
    pipeline = [{'$match': query}]
    pipeline.append({'$sort': {'move_datetime': -1}})
    if limit is not None:
        pipeline.append({'$limit': limit})
    pipeline.append({'$group': {
            '_id': '',
            'quantity': { '$sum': '$quantity' },
            'working_seconds': { '$sum': '$working_seconds'}
        }
    })
    pipeline.append({'$project': {
            '_id': 0,
            'total_quantity': '$quantity',
            'total_working_seconds': '$working_seconds'
        }
    })
    
    final_agg = list(db.touch_events.aggregate(pipeline))[0]
    return [final_agg['total_quantity'], final_agg['total_working_seconds']]

def calculate_pg_station_cycle_time(station_id, product_group_id, new_event):
    base_query = {'load_station_id':station_id, 'product_group_id': product_group_id, 'move_datetime': {'$ne': None}}

    recent_events = list(db.touch_events.find(base_query).sort('move_datetime', -1).limit(29))
    recent_events.append(new_event)
    first_event = list(db.touch_events.find(base_query).sort('move_datetime', 1).limit(1))
        
    if len(recent_events) > 2:
        first_event = first_event[0]
        
        [recent_quantity, recent_working_seconds] = aggregate(base_query, limit=29)
        [total_quantity, total_working_seconds] = aggregate(base_query, limit=None)
        
        recent_quantity += new_event['quantity']
        recent_working_seconds += new_event['working_seconds']
        
        total_quantity += new_event['quantity']
        total_working_seconds += new_event['working_seconds']
        
        print('+++++')
        print(recent_quantity, recent_working_seconds)
        print(total_quantity, total_working_seconds)
        print()
        
        # shift_details = db.settings.find_one()['shiftDetails']
        # current_datetime = new_event['move_datetime']
        # thirtieth_event_from_last_datetime = recent_events[0]['move_datetime']
        # first_datetime = first_event['move_datetime']
        
        # total_working_seconds = working_seconds_between_datetimes(shift_details, first_datetime, current_datetime)
        # recent_working_seconds = working_seconds_between_datetimes(shift_details, thirtieth_event_from_last_datetime, current_datetime)
                
        ps_historical_cycle_time = round(safe_divide(total_working_seconds, total_quantity))
        ps_cycle_time = round(safe_divide(recent_working_seconds, recent_quantity))
        
        return [ps_cycle_time, ps_historical_cycle_time]
    else:
        return [0,0]
        

# ===================================================== #
#                  Time Helper Functions                #
# ===================================================== #

def working_seconds_between_datetimes(shift_details, start, end):
    
    if type(start) == float or type(start) == int:
        start = datetime.fromtimestamp(start)
    if type(end) == float or type(end) == int:
        end = datetime.fromtimestamp(end)
    
    if start.date() == end.date():
        return calc_daily_working_seconds(shift_details, start.time(), end.time())
    else:
        first_day_working_seconds = calc_daily_working_seconds(shift_details, start.time(), None)
        last_day_working_seconds = calc_daily_working_seconds(shift_details, None, end.time())
        
        daily_working_seconds = calc_daily_working_seconds(shift_details, None, None)
        between_business_days = max(0, np.busday_count(start.date(), end.date()) - 1)
                
        return first_day_working_seconds + daily_working_seconds*between_business_days + last_day_working_seconds

def round_time(dt=None, delta=timedelta(minutes=1), to='average'):
    """
    Round a datetime object to a multiple of a timedelta
    dt : datetime.datetime object, default now.
    dateDelta : timedelta object, we round to a multiple of this, default 1 minute.
    from:  http://stackoverflow.com/questions/3463930/how-to-round-the-minute-of-a-datetime-object-python
    """
    minDt = datetime.now().replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)  
    
    round_to = delta.total_seconds()
    if dt is None:
        dt = datetime.now()
    seconds = (dt - minDt).seconds

    if seconds % round_to == 0 and dt.microsecond == 0:
        rounding = (seconds + round_to / 2) // round_to * round_to
    else:
        if to == 'ceil':
            # // is a floor division, not a comment on following line (like in javascript):
            rounding = (seconds + dt.microsecond/1000000 + round_to) // round_to * round_to
        elif to == 'floor':
            rounding = seconds // round_to * round_to
        else:
            rounding = (seconds + round_to / 2) // round_to * round_to

    return dt + timedelta(0, rounding - seconds, - dt.microsecond)

def calc_daily_working_seconds(shift_details, start_time=None, stop_time=None):
    
    begin_shift = time.strptime(shift_details['startOfShift'],'%H:%M')
    begin_shift_secs = timedelta(hours=begin_shift.tm_hour,minutes=begin_shift.tm_min,seconds=begin_shift.tm_sec).total_seconds()

    # Cant start before the shift starts
    if start_time is not None:
        start_time_secs = timedelta(hours=start_time.hour,minutes=start_time.minute,seconds=start_time.second).total_seconds()
        # start_time_secs = max(start_time_secs, begin_shift_secs) # Dont use, sometimes the start is outside of the shift and thats okay
    else: 
        start_time_secs = begin_shift_secs
    
    end_of_shift = time.strptime(shift_details['endOfShift'],'%H:%M')
    end_of_shift_secs = timedelta(hours=end_of_shift.tm_hour,minutes=end_of_shift.tm_min,seconds=end_of_shift.tm_sec).total_seconds()
    
    if stop_time is not None:
        end_time_secs = timedelta(hours=stop_time.hour,minutes=stop_time.minute,seconds=stop_time.second).total_seconds()
        # end_time_secs = min(stop_time_secs, end_of_shift_secs) # Dont use, sometimes the start is outside of the shift and thats okay
    else:
        end_time_secs = end_of_shift_secs
    
    # Total working seconds between the start and stop not including breaks
    working_seconds = max(0, (end_time_secs - start_time_secs))
    
    # Need to calculate the working time using shift details 
    breaks = shift_details['breaks'].values()
    # For each break, calculate the length of the break in seconds and ad to total break time
    for br in breaks:
        if(br['enabled']):
            br_start_time = time.strptime(br['startOfBreak'],'%H:%M')
            br_start_secs = timedelta(hours=br_start_time.tm_hour,minutes=br_start_time.tm_min,seconds=br_start_time.tm_sec).total_seconds()
            br_start_secs = max(start_time_secs, min(br_start_secs, end_time_secs))
                        
            br_end_time = time.strptime(br['endOfBreak'],'%H:%M')
            br_end_secs = timedelta(hours=br_end_time.tm_hour,minutes=br_end_time.tm_min,seconds=br_end_time.tm_sec).total_seconds()
            br_end_secs = max(start_time_secs, min(br_end_secs, end_time_secs))
                        
            working_seconds -= max(0, (br_end_secs - br_start_secs))
            
    return working_seconds