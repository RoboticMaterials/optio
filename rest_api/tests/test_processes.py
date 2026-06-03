"""
Test Suite: Processes
- Create a process linking stations via routes
- Read process
- Update process
- Delete process and its routes
"""

import pytest
from bson.objectid import ObjectId
from helpers import make_station as _make_station, make_route as _make_route, make_process as _make_process


class TestProcessCRUD:

    def test_create_linear_process(self, db, map_id):
        """A process spanning three stations is created with correct structure."""
        s1 = _make_station(db, map_id, "S1")
        s2 = _make_station(db, map_id, "S2")
        s3 = _make_station(db, map_id, "S3")

        r1 = _make_route(db, map_id, "TBD", s1["_id"], s2["_id"])
        r2 = _make_route(db, map_id, "TBD", s2["_id"], s3["_id"])

        p = _make_process(db, map_id, "Assembly Line",
                          [s1["_id"], s2["_id"], s3["_id"]],
                          [r1["_id"], r2["_id"]])

        assert p["_id"] is not None
        assert p["name"] == "Assembly Line"
        assert len(p["flattened_stations"]) == 3
        assert len(p["routes"]) == 2

        db.tasks.delete_many({"map_id": map_id})
        db.processes.delete_many({"map_id": map_id})
        db.stations.delete_many({"map_id": map_id})

    def test_process_references_correct_stations(self, db, map_id):
        s1 = _make_station(db, map_id, "Start")
        s2 = _make_station(db, map_id, "End")
        r = _make_route(db, map_id, "TBD", s1["_id"], s2["_id"])
        p = _make_process(db, map_id, "Two-Step", [s1["_id"], s2["_id"]], [r["_id"]])

        station_ids = [node["stationID"] for node in p["flattened_stations"]]
        assert s1["_id"] in station_ids
        assert s2["_id"] in station_ids

        db.tasks.delete_many({"map_id": map_id})
        db.processes.delete_many({"map_id": map_id})
        db.stations.delete_many({"map_id": map_id})

    def test_update_process_name(self, db, map_id):
        s1 = _make_station(db, map_id, "X")
        r = _make_route(db, map_id, "TBD", s1["_id"], "FINISH")
        p = _make_process(db, map_id, "Old Name", [s1["_id"]], [r["_id"]])

        db.processes.update_one({"_id": p["_id"]}, {"$set": {"name": "New Name"}})
        updated = db.processes.find_one({"_id": p["_id"]})
        assert updated["name"] == "New Name"

        db.tasks.delete_many({"map_id": map_id})
        db.processes.delete_many({"map_id": map_id})
        db.stations.delete_many({"map_id": map_id})

    def test_delete_process_and_routes(self, db, map_id):
        """Deleting a process and then its routes leaves nothing behind."""
        s1 = _make_station(db, map_id, "A")
        s2 = _make_station(db, map_id, "B")
        r = _make_route(db, map_id, "TBD", s1["_id"], s2["_id"])
        p = _make_process(db, map_id, "Deletable", [s1["_id"], s2["_id"]], [r["_id"]])

        pid = p["_id"]
        db.processes.delete_one({"_id": pid})
        db.tasks.delete_many({"processId": pid})

        assert db.processes.find_one({"_id": pid}) is None
        assert db.tasks.find_one({"processId": pid}) is None

        db.stations.delete_many({"map_id": map_id})

    def test_delete_stations_used_by_process(self, db, map_id):
        """Stations can be deleted; process record reflects stale refs (expected — app validates)."""
        s1 = _make_station(db, map_id, "Temp1")
        s2 = _make_station(db, map_id, "Temp2")
        r = _make_route(db, map_id, "TBD", s1["_id"], s2["_id"])
        p = _make_process(db, map_id, "Process", [s1["_id"], s2["_id"]], [r["_id"]])

        db.stations.delete_one({"_id": s1["_id"]})
        db.stations.delete_one({"_id": s2["_id"]})

        assert db.stations.find_one({"_id": s1["_id"]}) is None
        assert db.stations.find_one({"_id": s2["_id"]}) is None
        # Process record still exists
        assert db.processes.find_one({"_id": p["_id"]}) is not None

        db.tasks.delete_many({"map_id": map_id})
        db.processes.delete_many({"map_id": map_id})
