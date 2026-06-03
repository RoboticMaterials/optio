"""
Test Suite: End-to-End Scenario
Simulates a realistic factory flow:
  1. Create stations
  2. Create process between stations
  3. Create random lots at QUEUE
  4. Move lots through all stations to FINISH
  5. Open/close touch events at each station
  6. Delete stations, process, lots
"""

import pytest
import random
import string
import time
from datetime import datetime
from bson.objectid import ObjectId
from helpers import (
    make_station as _make_station,
    make_route as _make_route,
    make_process as _make_process,
    make_card as _make_card,
    open_touch_event as _open_touch_event,
    close_touch_event as _close_touch_event,
    cleanup,
)


def _random_lot_name():
    suffix = "".join(random.choices(string.digits, k=4))
    return f"WO-{suffix}"


class TestEndToEnd:

    def test_full_factory_flow(self, db, map_id):
        """
        Complete happy-path scenario:
        stations → process → lots → move through stations → work events → cleanup
        """
        # ── 1. Create three stations ──────────────────────────────────────────
        s1 = _make_station(db, map_id, "Cutting")
        s2 = _make_station(db, map_id, "Welding")
        s3 = _make_station(db, map_id, "Painting")

        assert db.stations.count_documents({"map_id": map_id}) == 3

        # ── 2. Create process ─────────────────────────────────────────────────
        r1 = _make_route(db, map_id, "TBD", s1["_id"], s2["_id"])
        r2 = _make_route(db, map_id, "TBD", s2["_id"], s3["_id"])
        process = _make_process(db, map_id, "Full Flow",
                                [s1["_id"], s2["_id"], s3["_id"]],
                                [r1["_id"], r2["_id"]])
        db.tasks.update_many(
            {"_id": {"$in": [r1["_id"], r2["_id"]]}},
            {"$set": {"processId": process["_id"]}}
        )
        assert db.processes.find_one({"_id": process["_id"]}) is not None

        # ── 3. Create 5 random lots at QUEUE ──────────────────────────────────
        lots = [
            _make_card(db, map_id, process["_id"], _random_lot_name(),
                       station_id="QUEUE", count=random.randint(1, 20))
            for _ in range(5)
        ]
        assert db.cards.count_documents({"process_id": process["_id"]}) == 5

        stations = [s1, s2, s3]

        for lot in lots:
            # ── 4 & 5. Move lot through each station, open/close work ─────────
            for i, station in enumerate(stations):
                # Move card bin to this station
                db.cards.update_one(
                    {"_id": lot["_id"]},
                    {"$set": {"bins": {station["_id"]: {"count": lot["totalQuantity"]}}}}
                )
                refreshed = db.cards.find_one({"_id": lot["_id"]})
                assert station["_id"] in refreshed["bins"]
                if i > 0:
                    assert stations[i - 1]["_id"] not in refreshed["bins"]

                # Open work event
                te = _open_touch_event(db, map_id, lot["_id"], station["_id"], process["_id"])
                assert te["move_datetime"] is None

                # Simulate work time
                time.sleep(0.01)

                # Close work event
                closed = _close_touch_event(db, te["_id"])
                assert closed["move_datetime"] is not None

            # Move to FINISH
            db.cards.update_one(
                {"_id": lot["_id"]},
                {"$set": {"bins": {"FINISH": {"count": lot["totalQuantity"]}}}}
            )
            finished = db.cards.find_one({"_id": lot["_id"]})
            assert "FINISH" in finished["bins"]

        # Verify every lot has 3 closed touch events
        for lot in lots:
            history = list(db.touch_events.find({"lot_id": lot["_id"]}))
            assert len(history) == 3
            assert all(e["move_datetime"] is not None for e in history)

        # ── 6. Delete everything ──────────────────────────────────────────────
        db.touch_events.delete_many({"map_id": map_id})
        db.cards.delete_many({"map_id": map_id})
        db.tasks.delete_many({"map_id": map_id})
        db.processes.delete_many({"map_id": map_id})
        db.stations.delete_many({"map_id": map_id})

        assert db.stations.count_documents({"map_id": map_id}) == 0
        assert db.processes.count_documents({"map_id": map_id}) == 0
        assert db.cards.count_documents({"map_id": map_id}) == 0
        assert db.touch_events.count_documents({"map_id": map_id}) == 0

    def test_reorder_lots_within_station(self, linear_process, db):
        """
        orderedIds ordering is a frontend concern, but the underlying card
        data is stable — reordering doesn't mutate bins.
        """
        process = linear_process["process"]
        map_id = linear_process["map_id"]
        s1 = linear_process["stations"][0]

        # Create 3 lots at the same station
        lots = [_make_card(db, map_id, process["_id"], f"Lot-{i}", station_id=s1["_id"])
                for i in range(3)]

        # Reorder (simulated by list sort — DB doesn't store order)
        ids = [l["_id"] for l in lots]
        reordered = list(reversed(ids))

        # Bins should be unchanged
        for lid in reordered:
            card = db.cards.find_one({"_id": lid})
            assert s1["_id"] in card["bins"]

    def test_cannot_have_lot_in_two_stations(self, linear_process, db):
        """A lot should only occupy one bin column at a time (enforced by PUT logic)."""
        card = linear_process["card"]
        s1 = linear_process["stations"][0]
        s2 = linear_process["stations"][1]

        # Simulate proper move: remove old bin, add new
        db.cards.update_one(
            {"_id": card["_id"]},
            {"$set": {"bins": {s1["_id"]: {"count": 1}}}}
        )
        db.cards.update_one(
            {"_id": card["_id"]},
            {"$set": {"bins": {s2["_id"]: {"count": 1}}}}
        )

        refreshed = db.cards.find_one({"_id": card["_id"]})
        # Only one bin should exist
        assert len(refreshed["bins"]) == 1
        assert s2["_id"] in refreshed["bins"]
        assert s1["_id"] not in refreshed["bins"]
