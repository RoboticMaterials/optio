"""
This is the schedule module and supports all the REST actions for the
schedule data
"""

from flask import request, make_response, abort, g
from bson.json_util import dumps
from bson.objectid import ObjectId
#from numpy import broadcast
#from datetime import datetime
from pymongo import ReturnDocument
from app import app
from ddb import client

db = client.ContactDB
collection = db.cards
counters_collection = db.counters


def findDiff(d1, d2, path=""):
    diffs = {}

    for k in d1:
        if (k not in d2):
            diffs[k] = {
                "new": d1[k]
            }
        else:
            if type(d1[k]) is dict:
                if path == "":
                    path = k
                else:
                    path = path + "->" + k

                more_diffs = findDiff(d1[k], d2[k], path)

                if bool(more_diffs):
                    diffs[k] = {
                        "new": d1[k],
                        "old": d2[k]
                    }

            else:
                if d1[k] != d2[k]:
                    diffs[k] = {
                        "new": d1[k],
                        "old": d2[k]
                    }
    return diffs


@app.route('/site_maps/<string:map_id>/cards', methods=['GET'])
def cards_read_all(map_id):
    """
    This function responds to a request for /api/cards
    with the complete lists of cards

    :return:        json string of list of cards
    """
    # Get list of cards
    cards = collection.find({'map_id': map_id})
    return dumps(cards)


@app.route('/processes/<string:process_id>/cards', methods=['GET'])
def cards_read_process_cards(process_id):
    """
    This function responds to a request for /api/processes/{process_id}/cards
    with the complete lists of cards with a process_id matching the provided argument

    :return:        json string of list of cards
    """
    # Create the list of schedules from our data
    cards = collection.find({"process_id": (process_id)})
    return dumps(cards)


@app.route('/stations/<string:station_id>/cards', methods=['GET'])
def cards_read_station_cards(station_id):
    """
    This function responds to a request for /api/processes/{process_id}/cards
    with the complete lists of cards with a process_id matching the provided argument

    :return:        json string of list of cards
    """
    # Create the list of schedules from our data
    cards = collection.find({"bins.{}".format(station_id): {'$exists': True}})
    # socketio.emit("message", "read station cards")
    return dumps(cards)


@app.route('/cards/<string:card_id>', methods=['GET'])
def cards_read_one(card_id):
    """
    This function responds to a request for /api/cards/{card_id}
    with one matching card from cards

    :param card_id:   Id of card to find
    :return:            card matching id
    """
    # Create the list of cards from our data
    card = collection.find_one({"_id": (card_id)})
    if card:
        return dumps(card)

    # Otherwise, nope, didn't find that schedule
    else:
        abort(
            404,
            "Card not found for Id: {card_id}".format(card_id=card_id),
        )


def get_next_sequence_value(sequence_name):
    sequenceDocument = counters_collection.find_one_and_update(
        {'_id': sequence_name},
        {'$inc': {'sequence_value': 1}},
        return_document=ReturnDocument.AFTER)
    return sequenceDocument['sequence_value']


@app.route('/cards', methods=['POST'])
def cards_create():
    """
    This function creates a new card in the cards structure
    based on the passed in card data

    :param card:  card to create in cards structure
    :return:        201 on success, 406 on card exists
    """

    card = request.get_json()
    card['_id'] = str(ObjectId())

    lot_number_counter = counters_collection.find_one({'_id': "lot_number"})
    if not lot_number_counter:
        try:
            counters_collection.insert_one(
                {"_id": "lot_number", "sequence_value": 0})
        except:
            print("lot_number counter was already made")

    get_next_sequence_value("lot_number")

    result = collection.insert_one(card)

    card_with_id = collection.find_one({'_id': result.inserted_id})

    # g.socket.emit('message', {
    #               "type": "cards", "method": "POST", "payload": card_with_id}, broadcast=True)
    return dumps(card_with_id)


@app.route('/cards/count', methods=['GET'])
def cards_get_count():
    lot_number_counter = counters_collection.find_one({'_id': "lot_number"})

    if not lot_number_counter:
        return 0
    else:
        return lot_number_counter['sequence_value']


@app.route('/cards/<string:card_id>', methods=['PUT'])
def cards_update(card_id):
    """
    This function updates an existing card in the cards structure
    Throws an error if a card with the name we want to update to
    already exists in the database.

    :param card_id:   Id of the card to update in the cards structure
    :param card:      card to update
    :return:            updated card structure
    """
    # Create the list of cards from our data
    card = request.get_json()
    old_card = collection.find_one({"_id": card_id})

    # Are we trying to find a card that does not exist?
    if old_card is None:
        abort(
            404,
            "Card not found for Id: {card_id}".format(card_id=card_id),
        )

    # Otherwise go ahead and update!
    else:
        result = collection.replace_one({"_id": (card_id)}, card)

        card_with_id = collection.find_one({"_id": (card_id)})
        # g.socket.emit('message', {
        #               "type": "cards", "method": "PUT", "payload": card_with_id}, broadcast=True)
        return dumps(card_with_id)


@app.route('/cards/<string:card_id>', methods=['DELETE'])
def cards_delete(card_id):
    """
    This function deletes a schedule from the schedules structure

    :param schedule_id:   Id of the schedule to delete
    :return:            200 on successful delete, 404 if not found
    """
    rtnd_card = collection.find({"_id": (card_id)})
    # Can we insert this schedule?
    if len(list(rtnd_card.clone())) != 0:
        collection.delete_one({"_id": (card_id)})
        # g.socket.emit('message', {
        #               "type": "cards", "method": "DELETE", "payload": card_id}, broadcast=True)
        return card_id

    # Otherwise, nope, didn't find that person
    else:
        abort(
            404,
            "Card not found for Id: {card_id}".format(card_id=card_id),
        )


@app.route('/site_maps/<string:map_id>/cards', methods=['DELETE'])
def cards_delete_all_on_map(map_id):
    collection.delete_many({'map_id': map_id})
