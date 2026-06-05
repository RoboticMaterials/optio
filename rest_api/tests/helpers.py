"""
Shared factory helpers for tests.
These are plain functions (not fixtures) so test files can import them directly.
"""

import time
from datetime import datetime
from bson.objectid import ObjectId


def make_station(db, map_id, name):
    doc = {
        "_id": str(ObjectId()),
        "name": name,
        "map_id": map_id,
        "type": "station",
        "cycle_times": {},
    }
    db.stations.insert_one(doc)
    return db.stations.find_one({"_id": doc["_id"]})


def make_route(db, map_id, process_id, load_id, unload_id):
    doc = {
        "_id": str(ObjectId()),
        "map_id": map_id,
        "processId": process_id,
        "load": load_id,
        "unload": unload_id,
        "divergeType": None,
    }
    db.tasks.insert_one(doc)
    return db.tasks.find_one({"_id": doc["_id"]})


def make_process(db, map_id, name, station_ids, route_ids):
    flattened = [{"stationID": sid} for sid in station_ids]
    doc = {
        "_id": str(ObjectId()),
        "name": name,
        "map_id": map_id,
        "routes": route_ids,
        "flattened_stations": flattened,
        "startDivergeType": None,
    }
    db.processes.insert_one(doc)
    return db.processes.find_one({"_id": doc["_id"]})


def make_card(db, map_id, process_id, name, station_id="QUEUE", count=1):
    doc = {
        "_id": str(ObjectId()),
        "name": name,
        "map_id": map_id,
        "process_id": process_id,
        "lotNum": 1,
        "totalQuantity": count,
        "bins": {station_id: {"count": count}},
        "flags": [],
    }
    db.cards.insert_one(doc)
    return db.cards.find_one({"_id": doc["_id"]})


def open_touch_event(db, map_id, lot_id, station_id, process_id, product_group_id="pg1"):
    doc = {
        "_id": str(ObjectId()),
        "map_id": map_id,
        "lot_id": lot_id,
        "load_station_id": station_id,
        "unload_station_id": None,
        "process_id": process_id,
        "product_group_id": product_group_id,
        "start_datetime": datetime.fromtimestamp(time.time()),
        "move_datetime": None,
        "quantity": 1,
        "working_seconds": None,
        "idle_seconds": None,
        "pgs_cycle_time": None,
    }
    db.touch_events.insert_one(doc)
    return db.touch_events.find_one({"_id": doc["_id"]})


def close_touch_event(db, touch_event_id):
    db.touch_events.update_one(
        {"_id": touch_event_id},
        {"$set": {"move_datetime": datetime.utcnow()}}
    )
    return db.touch_events.find_one({"_id": touch_event_id})


def cleanup(db, map_id):
    """Delete all test data for a given map_id."""
    db.touch_events.delete_many({"map_id": map_id})
    db.cards.delete_many({"map_id": map_id})
    db.tasks.delete_many({"map_id": map_id})
    db.processes.delete_many({"map_id": map_id})
    db.stations.delete_many({"map_id": map_id})
