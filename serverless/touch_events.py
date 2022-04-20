"""
This is the task analysis module and supports all the REST actions for the
task analysis data
"""

from flask import make_response, abort
from datetime import datetime
from bson.json_util import dumps
from bson.objectid import ObjectId
import pytz
from app import app
from ddb import client
from process_stats import calculate_process_production_rate, generate_process_summaries_until_date
from station_stats import calculate_pg_station_cycle_time, generate_station_summaries_until_date, working_seconds_between_datetimes


db = client.ContactDB
collection = db.touch_events

# Touch Event:
#     {
#         start_time,
#         move_time,
#         pauses: [],
#         lot_id,
#         product_group,
#         sku,
#         user,
#         notes,
#         quantity,
#         load_station_id,
#         unload_station_id,
#         dashboard_id,
#         route_id
#     }


def utc_to_local(utc_dt, tz):
    local_dt = utc_dt.replace(tzinfo=pytz.utc).astimezone(tz)
    return tz.normalize(local_dt)  # .normalize might be unnecessary


@app.route('/touch_events', methods=['GET'])
def touch_events_read_all():
    return collection.find()


@app.route('/touch_events', methods=['DELETE'])
def touch_events_delete_all():
    collection.delete_many({})


@app.route('/touch_events/site_map/<string:map_id>', methods=['DELETE'])
def touch_events_delete_all_on_map(map_id):
    collection.delete_many({'map_id': map_id})


@app.route('/touch_events/lot/<string:lot_id>', methods=['GET'])
def touch_events_get_by_lot(lot_id):
    # Create the list of site_maps from our data
    touch_events = collection.find({"lot_id": lot_id, 'move_datetime': {
                                   '$ne': None}}).sort('move_datetime')
    return dumps(touch_events)


def open_touch_event(touch_event):

    existing_touch_event = db.touch_events.find_one({
        'lot_id': touch_event['lot_id'],
        'load_station_id': touch_event['load_station_id'],
        'move_datetime': None
    })
    if existing_touch_event:
        collection.update_one({'_id': existing_touch_event['_id']}, {
                              '$set': touch_event})
        return dumps(existing_touch_event)

    # add id field
    id = str(ObjectId())
    touch_event['_id'] = id

    touch_event['start_datetime'] = datetime.fromtimestamp(
        touch_event['start_datetime'] / 1000)

    result = collection.insert_one(touch_event)
    touch_event_with_id = collection.find_one({'_id': result.inserted_id})

    touch_event_with_id['start_datetime'] = datetime.timestamp(
        touch_event_with_id['start_datetime']) * 1000  # Handles the timezone issue for the dashboard timer

    return dumps(touch_event_with_id)


def close_touch_event(touch_event):

    existing_touch_event = db.touch_events.find_one({
        'lot_id': touch_event['lot_id'],
        'load_station_id': touch_event['load_station_id'],
        'move_datetime': None
    })

    print(existing_touch_event)

    if not existing_touch_event:
        abort(
            404,
            "Open lot not found"
        )

    touch_event = {**existing_touch_event, **touch_event}

    settings = db.settings.find_one()
    shift_details = settings['shiftDetails']
    tz_label = settings['timezone']['label']
    tz = pytz.timezone(tz_label)

    move_timestamp = touch_event['move_datetime'] / 1000
    start_timestamp = datetime.timestamp(touch_event['start_datetime'])
    touch_event['working_seconds'] = round(move_timestamp - start_timestamp)
    touch_event['idle_seconds'] = 0
    touch_event['move_datetime'] = datetime.fromtimestamp(move_timestamp)

    if touch_event['load_station_id'] == 'QUEUE':
        pgs_cycle_time = 0
    else:
        [pgs_cycle_time, pgs_historical_cycle_time] = calculate_pg_station_cycle_time(
            touch_event['load_station_id'], touch_event['product_group_id'], touch_event)
        db.stations.update_one(
            {'_id': touch_event['load_station_id']},
            {'$set': {
                'cycle_times.{}.actual'.format(touch_event['product_group_id']): pgs_cycle_time,
                'cycle_times.{}.historical'.format(touch_event['product_group_id']): pgs_historical_cycle_time,
                # 'cycle_times.{}.last_moved'.format(touch_event['product_group_id']): move_timestamp*1000
            }}
        )
    touch_event['pgs_cycle_time'] = pgs_cycle_time

    result = collection.replace_one({'_id': touch_event['_id']}, touch_event)
    print("CLOSE", touch_event)

    # To track value creating time, we calculate the average arrival time for every lot move event (where it came into this station)
    lot_arrival_events = list(collection.find(
        {'lot_id': touch_event['lot_id'], 'unload_station_id': touch_event['load_station_id']}).sort('move_datetime'))
    if len(lot_arrival_events) > 0:

        ave_arrival_time = sum([e['quantity']*datetime.timestamp(e['move_datetime'])
                               for e in lot_arrival_events]) / sum([e['quantity'] for e in lot_arrival_events])

        lot_departure_events = list(collection.find({'$and': [{'lot_id': touch_event['lot_id']}, {
                                    'load_station_id': touch_event['load_station_id']}]}).sort('move_datetime'))
        for lot_departure_event in lot_departure_events:
            idle_seconds = working_seconds_between_datetimes(
                shift_details, ave_arrival_time, lot_departure_event['move_datetime'])
            collection.update_one({'_id': lot_departure_event['_id']}, {
                                  '$set': {'idle_seconds': round(idle_seconds)}})

    if touch_event['load_station_id'] != 'QUEUE':
        # NOTE: Its neccessary to generate summaries for all stations because its possible one station hasnt been used that day
        process = db.processes.find_one({'_id': touch_event['process_id']})
        process_station_ids = [node['stationID']
                               for node in process['flattened_stations']]
        for station_id in process_station_ids:
            generate_station_summaries_until_date(
                station_id, touch_event['move_datetime'])
        # generate_station_summaries_until_date(touch_event['load_station_id'], touch_event['move_datetime'])
        generate_process_summaries_until_date(
            touch_event['process_id'], touch_event['move_datetime'])
        process_production_rate = calculate_process_production_rate(
            touch_event['process_id'])
        db.processes.update_one({'_id': touch_event['process_id']}, {
                                '$set': {'production_rate': process_production_rate}})

    return dumps(touch_event)


@app.route('/touch_events', methods=['POST'])
def touch_events_create(touch_event, option=None):

    if option is None:
        return full_create(touch_event)
    elif option == 'open':
        return open_touch_event(touch_event)
    elif option == 'close':
        return close_touch_event(touch_event)
    else:
        abort(
            404,
            "Option is not valid"
        )


def full_create(touch_event):

    # add id field
    id = str(ObjectId())
    touch_event['_id'] = id

    settings = db.settings.find_one()
    shift_details = settings['shiftDetails']
    tz_label = settings['timezone']['label']
    tz = pytz.timezone(tz_label)

    # add to collection
    touch_event['start_datetime'] = datetime.fromtimestamp(
        touch_event['start_datetime'] / 1000)
    touch_event['move_datetime'] = datetime.fromtimestamp(
        touch_event['move_datetime'] / 1000)
    touch_event['working_seconds'] = working_seconds_between_datetimes(
        shift_details, touch_event['move_datetime'], touch_event['start_datetime'])
    touch_event['idle_seconds'] = 0

    if touch_event['load_station_id'] == 'QUEUE':
        pgs_cycle_time = 0
    else:
        [pgs_cycle_time, pgs_historical_cycle_time] = calculate_pg_station_cycle_time(
            touch_event['load_station_id'], touch_event['product_group_id'], touch_event)
        db.stations.update_one(
            {'_id': touch_event['load_station_id']},
            {'$set': {
                'cycle_times.{}.actual'.format(touch_event['product_group_id']): pgs_cycle_time,
                'cycle_times.{}.historical'.format(touch_event['product_group_id']): pgs_historical_cycle_time,
                'cycle_times.{}.last_moved'.format(touch_event['product_group_id']): datetime.timestamp(touch_event['move_datetime'])*1000
            }}
        )
    touch_event['pgs_cycle_time'] = pgs_cycle_time

    result = collection.insert_one(touch_event)
    touch_event_with_id = collection.find_one({'_id': result.inserted_id})

    # To track value creating time, we calculate the average arrival time for every lot move event (where it came into this station)
    lot_arrival_events = list(collection.find(
        {'lot_id': touch_event['lot_id'], 'unload_station_id': touch_event['load_station_id']}).sort('move_datetime'))
    if len(lot_arrival_events) > 0:

        ave_arrival_time = datetime.fromtimestamp(sum([e['quantity']*datetime.timestamp(
            e['move_datetime']) for e in lot_arrival_events]) / sum([e['quantity'] for e in lot_arrival_events]))

        lot_departure_events = list(collection.find({'$and': [{'lot_id': touch_event['lot_id']}, {
                                    'load_station_id': touch_event['load_station_id']}]}).sort('move_datetime'))
        for lot_departure_event in lot_departure_events:
            idle_seconds = working_seconds_between_datetimes(
                shift_details, ave_arrival_time, lot_departure_event['move_datetime'])
            collection.update_one({'_id': lot_departure_event['_id']}, {
                                  '$set': {'idle_seconds': round(idle_seconds)}})

    if touch_event['load_station_id'] != 'QUEUE':
        # NOTE: Its neccessary to generate summaries for all stations because its possible one station hasnt been used that day
        process = db.processes.find_one({'_id': touch_event['process_id']})
        process_station_ids = [node['stationID']
                               for node in process['flattened_stations']]
        for station_id in process_station_ids:
            generate_station_summaries_until_date(
                station_id, touch_event['move_datetime'])
        # generate_station_summaries_until_date(touch_event['load_station_id'], touch_event['move_datetime'])
        generate_process_summaries_until_date(
            touch_event['process_id'], touch_event['move_datetime'])
        process_production_rate = calculate_process_production_rate(
            touch_event['process_id'])
        db.processes.update_one({'_id': touch_event['process_id']}, {
                                '$set': {'production_rate': process_production_rate}})

    return dumps(touch_event_with_id)


@app.route('/touch_events/site_map/<string:station_id>/open_events', methods=['GET'])
def touch_events_get_open_touch_events_for_station(station_id):
    open_touch_events = list(db.touch_events.find({
        'load_station_id': station_id,
        'move_datetime': None
    }))

    for i in range(len(open_touch_events)):
        # This is necessary because of the way the frontend messes with the timezone. Only pass timestamps
        open_touch_events[i]['start_datetime'] = datetime.timestamp(
            open_touch_events[i]['start_datetime']) * 1000

    return dumps(open_touch_events)


@app.route('/touch_events/site_map/<string:map_id>/open_events', methods=['GET'])
def touch_events_get_open_touch_events(map_id):
    stations = db.stations.find({'map_id': map_id})
    station_ids = [station['_id'] for station in stations]

    open_touch_events = list(db.touch_events.find({
        'map_id': map_id,
        'load_station_id': {'$in': station_ids},
        'move_datetime': None
    }))

    for i in range(len(open_touch_events)):
        # This is necessary because of the way the frontend messes with the timezone. Only pass timestamps
        open_touch_events[i]['start_datetime'] = datetime.timestamp(
            open_touch_events[i]['start_datetime']) * 1000

    open_touch_events_nrml = {
        [station_id]: [open_te for open_te in open_touch_events if open_te['load_station_id'] == station_id]
        for station_id in station_ids}

    return dumps(open_touch_events_nrml)


@app.route('/touch_events/<string:event_id>', methods=['DELETE'])
def touch_events_delete(event_id):
    """
    This function deletes a station from the events structure

    :param station_id:   Id of the event to delete
    :return:            200 on successful delete, 404 if not found
    """
    rtnd_event = collection.find({"_id": event_id})
    # Can we insert this station?
    if len(list(rtnd_event.clone())) != 0:
        collection.delete_one({"_id": event_id})

    # Otherwise, nope, didn't find that person
    else:
        abort(
            404,
            "station not found for Id: {event_id}".format(event_id=event_id),
        )
