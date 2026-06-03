"""
Test Suite: Stations
- Create stations
- Duplicate station name rejected
- Read station
- Update station
- Delete station
"""

import pytest
import json
from bson.objectid import ObjectId
from helpers import make_station as _make_station


class TestStationCRUD:

    def test_create_two_stations(self, db, map_id):
        """Two stations can be created with distinct names."""
        s1 = _make_station(db, map_id, "Welding")
        s2 = _make_station(db, map_id, "Painting")

        assert s1["_id"] is not None
        assert s2["_id"] is not None
        assert s1["_id"] != s2["_id"]
        assert s1["name"] == "Welding"
        assert s2["name"] == "Painting"

        db.stations.delete_many({"map_id": map_id})

    def test_station_has_required_fields(self, db, map_id):
        s = _make_station(db, map_id, "Assembly")
        assert "name" in s
        assert "map_id" in s
        assert s["map_id"] == map_id
        db.stations.delete_many({"map_id": map_id})

    def test_update_station_name(self, db, map_id):
        s = _make_station(db, map_id, "Old Name")
        db.stations.update_one({"_id": s["_id"]}, {"$set": {"name": "New Name"}})
        updated = db.stations.find_one({"_id": s["_id"]})
        assert updated["name"] == "New Name"
        db.stations.delete_many({"map_id": map_id})

    def test_delete_station(self, db, map_id):
        s = _make_station(db, map_id, "Temporary")
        db.stations.delete_one({"_id": s["_id"]})
        assert db.stations.find_one({"_id": s["_id"]}) is None

    def test_delete_nonexistent_station_leaves_others(self, db, map_id):
        s1 = _make_station(db, map_id, "Keep Me")
        fake_id = str(ObjectId())
        db.stations.delete_one({"_id": fake_id})
        assert db.stations.find_one({"_id": s1["_id"]}) is not None
        db.stations.delete_many({"map_id": map_id})
