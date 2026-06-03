"""
Test Suite: Lots (Cards)
- Create lots at QUEUE
- Read lots by process
- Move a lot from QUEUE to a station
- Move a lot between stations
- Move a lot to FINISH
- Create multiple random lots
"""

import pytest
import random
import string
from bson.objectid import ObjectId
from helpers import make_card as _make_card


def _random_name(prefix="Lot"):
    suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"{prefix}-{suffix}"


class TestLotCRUD:

    def test_create_lot_in_queue(self, linear_process, db):
        """A lot is created and lands in QUEUE."""
        card = linear_process["card"]
        assert card is not None
        assert "QUEUE" in card["bins"]
        assert card["bins"]["QUEUE"]["count"] == 1

    def test_create_multiple_random_lots(self, linear_process, db):
        """Ten lots with random names can be created without collision."""
        process = linear_process["process"]
        map_id = linear_process["map_id"]
        created = []
        for _ in range(10):
            c = _make_card(db, map_id, process["_id"], _random_name(), count=random.randint(1, 50))
            created.append(c)

        assert len(created) == 10
        ids = {c["_id"] for c in created}
        assert len(ids) == 10  # all unique

    def test_read_lots_by_process(self, linear_process, db):
        """Querying cards by process_id returns the lot we created."""
        process = linear_process["process"]
        map_id = linear_process["map_id"]
        _make_card(db, map_id, process["_id"], "Extra Lot")
        cards = list(db.cards.find({"process_id": process["_id"]}))
        assert len(cards) >= 2

    def test_move_lot_from_queue_to_station(self, linear_process, db):
        """Moving a lot: remove QUEUE bin, add station bin."""
        card = linear_process["card"]
        s1 = linear_process["stations"][0]

        updated_bins = {s1["_id"]: {"count": card["bins"]["QUEUE"]["count"]}}
        db.cards.update_one(
            {"_id": card["_id"]},
            {"$set": {"bins": updated_bins}}
        )
        refreshed = db.cards.find_one({"_id": card["_id"]})
        assert "QUEUE" not in refreshed["bins"]
        assert s1["_id"] in refreshed["bins"]

    def test_move_lot_between_stations(self, linear_process, db):
        """Moving a lot from station 1 to station 2."""
        card = linear_process["card"]
        s1 = linear_process["stations"][0]
        s2 = linear_process["stations"][1]

        # Place at s1
        db.cards.update_one({"_id": card["_id"]}, {"$set": {"bins": {s1["_id"]: {"count": 1}}}})

        # Move to s2
        db.cards.update_one({"_id": card["_id"]}, {"$set": {"bins": {s2["_id"]: {"count": 1}}}})

        refreshed = db.cards.find_one({"_id": card["_id"]})
        assert s1["_id"] not in refreshed["bins"]
        assert s2["_id"] in refreshed["bins"]

    def test_move_lot_to_finish(self, linear_process, db):
        """Moving a lot all the way to FINISH."""
        card = linear_process["card"]

        db.cards.update_one({"_id": card["_id"]}, {"$set": {"bins": {"FINISH": {"count": 1}}}})
        refreshed = db.cards.find_one({"_id": card["_id"]})
        assert "FINISH" in refreshed["bins"]
        assert "QUEUE" not in refreshed["bins"]

    def test_delete_lot(self, linear_process, db):
        process = linear_process["process"]
        map_id = linear_process["map_id"]
        card = _make_card(db, map_id, process["_id"], "Deletable Lot")
        cid = card["_id"]
        db.cards.delete_one({"_id": cid})
        assert db.cards.find_one({"_id": cid}) is None
