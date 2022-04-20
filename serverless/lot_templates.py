"""
This is the lot_templates module and supports all the REST actions for the
lot_templates data
"""

from flask import make_response, abort
from bson.json_util import dumps
from bson.objectid import ObjectId
from datetime import datetime
import uuid
from app import app
from ddb import client


db = client.ContactDB
collection = db.lot_templates


@app.route('/site_maps/<string:map_id>/cards/templates', methods=['GET'])
def lot_templates_read_all(map_id):
    """
    This function responds to a request for /api/lot_templates
    with the complete lists of lot_templates

    :return:        json string of list of lot_templates
    """
    # Get list of cards
    lot_templates = collection.find({'map_id': map_id})
    return dumps(lot_templates)


@app.route('/cards/templates/<string:id>', methods=['GET'])
def lot_templates_read_one(id):
    """
    This function responds to a request for /api/cards/{card_id}
    with one matching card from cards

    :param card_id:   Id of card to find
    :return:            card matching id
    """
    # Create the list of cards from our data
    lot_template = collection.find_one({"_id": (id)})
    if lot_template:
        return dumps(lot_template)

    # Otherwise, nope, didn't find that schedule
    else:
        abort(
            404,
            "Lot Template not found for Id: {id}".format(id=id),
        )


@app.route('/cards/templates', methods=['POST'])
def lot_templates_create(lot_template):
    """
    This function creates a new card in the cards structure
    based on the passed in card data

    :param card:  card to create in cards structure
    :return:        201 on success, 406 on card exists
    """

    lot_template['_id'] = str(ObjectId())
    result = collection.insert_one(lot_template)

    lot_template_with_id = collection.find_one({'_id': result.inserted_id})

    return dumps(lot_template_with_id)


@app.route('/cards/templates/<string:id>', methods=['PUT'])
def lot_templates_update(id, lot_template):
    """
    This function updates an existing card in the cards structure
    Throws an error if a card with the name we want to update to
    already exists in the database.

    :param card_id:   Id of the card to update in the cards structure
    :param card:      card to update
    :return:            updated card structure
    """
    # Create the list of cards from our data
    old_lot_template = collection.find_one({"_id": id})

    # Are we trying to find a card that does not exist?
    if old_lot_template is None:
        abort(
            404,
            "Lot Template not found for Id: {id}".format(id=id),
        )

    # Otherwise go ahead and update!
    else:
        result = collection.replace_one({"_id": (id)}, lot_template)

        lot_template_with_id = collection.find_one({"_id": (id)})
        return dumps(lot_template_with_id)


@app.route('/cards/templates/<string:id>', methods=['DELETE'])
def lot_templates_delete(id):
    """
    This function deletes a schedule from the schedules structure

    :param schedule_id:   Id of the schedule to delete
    :return:            200 on successful delete, 404 if not found
    """
    rtnd_card = collection.find({"_id": (id)})
    # Can we insert this schedule?
    if len(list(rtnd_card.clone())) != 0:
        collection.delete_one({"_id": (id)})

    # Otherwise, nope, didn't find that person
    else:
        abort(
            404,
            "Card not found for Id: {card_id}".format(card_id=card_id),
        )
