"""
Test Suite: Work (Touch Events)
- Start work on a lot (open touch event)
- Finish work on a lot (close touch event)
- Cannot close an event that was never opened
- Multiple lots can be worked simultaneously
"""

import pytest
import time
from datetime import datetime
from bson.objectid import ObjectId
from helpers import make_card as _make_card, open_touch_event as _open_touch_event, close_touch_event as _close_touch_event


class TestTouchEvents:

    def test_open_touch_event(self, linear_process, db):
        """Starting work creates an open touch event (move_datetime is None)."""
        card = linear_process["card"]
        s1 = linear_process["stations"][0]
        process = linear_process["process"]
        map_id = linear_process["map_id"]

        te = _open_touch_event(db, map_id, card["_id"], s1["_id"], process["_id"])

        assert te is not None
        assert te["lot_id"] == card["_id"]
        assert te["load_station_id"] == s1["_id"]
        assert te["move_datetime"] is None
        assert te["start_datetime"] is not None

    def test_close_touch_event(self, linear_process, db):
        """Finishing work sets move_datetime on the touch event."""
        card = linear_process["card"]
        s1 = linear_process["stations"][0]
        process = linear_process["process"]
        map_id = linear_process["map_id"]

        te = _open_touch_event(db, map_id, card["_id"], s1["_id"], process["_id"])
        closed = _close_touch_event(db, te["_id"])

        assert closed["move_datetime"] is not None
        assert isinstance(closed["move_datetime"], datetime)

    def test_close_requires_open_event(self, linear_process, db):
        """Attempting to close a non-existent event finds nothing."""
        fake_id = str(ObjectId())
        result = db.touch_events.find_one({"_id": fake_id, "move_datetime": None})
        assert result is None

    def test_open_event_query_by_station(self, linear_process, db):
        """Open events for a station can be retrieved."""
        card = linear_process["card"]
        s1 = linear_process["stations"][0]
        process = linear_process["process"]
        map_id = linear_process["map_id"]

        _open_touch_event(db, map_id, card["_id"], s1["_id"], process["_id"])

        open_events = list(db.touch_events.find({
            "load_station_id": s1["_id"],
            "move_datetime": None
        }))
        assert len(open_events) >= 1
        assert all(e["move_datetime"] is None for e in open_events)

    def test_multiple_lots_open_simultaneously(self, linear_process, db):
        """Two lots can each have an open event at the same station."""
        process = linear_process["process"]
        map_id = linear_process["map_id"]
        s1 = linear_process["stations"][0]

        card2 = _make_card(db, map_id, process["_id"], "Lot-Concurrent-A")
        card3 = _make_card(db, map_id, process["_id"], "Lot-Concurrent-B")

        te1 = _open_touch_event(db, map_id, card2["_id"], s1["_id"], process["_id"])
        te2 = _open_touch_event(db, map_id, card3["_id"], s1["_id"], process["_id"])

        assert te1["lot_id"] != te2["lot_id"]

        open_events = list(db.touch_events.find({
            "load_station_id": s1["_id"],
            "move_datetime": None,
            "map_id": map_id,
        }))
        assert len(open_events) >= 2

    def test_full_work_cycle(self, linear_process, db):
        """Full cycle: open at s1, close at s1, open at s2, close at s2."""
        card = linear_process["card"]
        s1 = linear_process["stations"][0]
        s2 = linear_process["stations"][1]
        process = linear_process["process"]
        map_id = linear_process["map_id"]

        # Start at s1
        te1 = _open_touch_event(db, map_id, card["_id"], s1["_id"], process["_id"])
        assert te1["move_datetime"] is None

        # Finish at s1
        te1_closed = _close_touch_event(db, te1["_id"])
        assert te1_closed["move_datetime"] is not None

        # Move card bins
        db.cards.update_one({"_id": card["_id"]}, {"$set": {"bins": {s2["_id"]: {"count": 1}}}})

        # Start at s2
        te2 = _open_touch_event(db, map_id, card["_id"], s2["_id"], process["_id"])
        assert te2["move_datetime"] is None

        # Finish at s2
        te2_closed = _close_touch_event(db, te2["_id"])
        assert te2_closed["move_datetime"] is not None

        # Verify history
        history = list(db.touch_events.find({"lot_id": card["_id"]}))
        assert len(history) == 2
        assert all(e["move_datetime"] is not None for e in history)
