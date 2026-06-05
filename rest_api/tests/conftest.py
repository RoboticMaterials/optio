"""
pytest fixtures shared across all test modules.
Helper factory functions live in helpers.py.
"""

import pytest
from bson.objectid import ObjectId
from pymongo import MongoClient
from helpers import make_station, make_route, make_process, make_card, cleanup


@pytest.fixture(scope="session")
def db():
    client = MongoClient("localhost:27017")
    return client.ContactDB


@pytest.fixture()
def map_id():
    """A unique map id per test — keeps tests fully isolated."""
    return f"test-map-{ObjectId()}"


@pytest.fixture()
def linear_process(db, map_id):
    """
    Three-station linear process with one lot at QUEUE.
    Tears down all test data after the test.
    """
    s1 = make_station(db, map_id, "Station Alpha")
    s2 = make_station(db, map_id, "Station Beta")
    s3 = make_station(db, map_id, "Station Gamma")

    r1 = make_route(db, map_id, "TBD", s1["_id"], s2["_id"])
    r2 = make_route(db, map_id, "TBD", s2["_id"], s3["_id"])

    process = make_process(
        db, map_id, "Test Process",
        [s1["_id"], s2["_id"], s3["_id"]],
        [r1["_id"], r2["_id"]],
    )
    db.tasks.update_many(
        {"_id": {"$in": [r1["_id"], r2["_id"]]}},
        {"$set": {"processId": process["_id"]}}
    )

    card = make_card(db, map_id, process["_id"], "Lot-001", station_id="QUEUE")

    yield {
        "map_id": map_id,
        "stations": [s1, s2, s3],
        "routes": [r1, r2],
        "process": process,
        "card": card,
    }

    cleanup(db, map_id)
