"""
This is the events module and supports all the REST actions for the
events data
"""

from flask import request, make_response, abort
from bson.json_util import dumps
from bson.objectid import ObjectId
import json
from app import app
from ddb import client

db = client.ContactDB
collection = db.events


@app.route('/events', methods=['GET'])
def events_read_all():
    """
    This function responds to a request for /api/events
    with the complete lists of events

    :return:        json string of list of events
    """
    # Create the list of events from our data
    events = collection.find()
    return dumps(events)


@app.route('/events/<string:event_id>', methods=['GET'])
def events_read_one(event_id):
    """
    This function responds to a request for /api/events/{event_id}
    with one matching event from events

    :param event_id:   Id of event to find
    :return:            event matching id
    """
    # Create the list of events from our data
    event = collection.find({"_id": ObjectId(event_id)})
    if len(list(event.clone())) != 0:
        return dumps(event)
    # Otherwise, nope, didn't find that event
    else:
        abort(
            404,
            "event not found for Id: {event_id}".format(event_id=event_id),
        )


@app.route('/events', methods=['POST'])
def events_create():
    """
    This function creates a new event in the events structure
    based on the passed in event data

    :param event:  event to create in events structure
    :return:        201 on success, 406 on event exists
    """
    event = request.get_json()
    rtnd_event = collection.find({"name": event["name"]})
    # Can we insert this event?
    if len(list(rtnd_event.clone())) == 0:
        result = collection.insert_one(event)
        event_with_id = collection.find_one({'_id': result.inserted_id})
        return dumps(event_with_id)

    # Otherwise, nope, event exists already
    else:
        abort(
            409,
            "event {name} exists already".format(
                name=event["name"]
            ),
        )


@app.route('/events/<string:event_id>', methods=['PUT'])
def events_update(event_id):
    """
    This function updates an existing event in the events structure
    Throws an error if a event with the name we want to update to
    already exists in the database.

    :param event_id:   Id of the event to update in the events structure
    :param event:      event to update
    :return:            updated event structure
    """
    event = request.get_json()
    # Are we trying to find a event that does not exist?
    rtn_event_1 = list(collection.find({"_id": ObjectId(event_id)}))
    if len(rtn_event_1) == 0:
        abort(
            404,
            "event not found for Id: {event_id}".format(event_id=event_id),
        )

    # # Would our update create a duplicate of another event already existing?
    # rtn_event_2 = list(collection.find({"name":event["name"]}))
    # if len(rtn_event_2) != 0 and rtn_event_2['_id'] != rtn_event_1['_id'] :
    #     abort(
    #         409,
    #         "event {name} exists already".format(
    #             name=event["name"]
    #         ),
    #     )

    result = collection.replace_one({"_id": ObjectId(event_id)}, event)
    event_with_id = collection.find_one({"_id": ObjectId(event_id)})
    return dumps(event_with_id)


@app.route('/events/<string:event_id>', methods=['DELETE'])
def events_delete(event_id):
    """
    This function deletes a event from the events structure

    :param event_id:   Id of the event to delete
    :return:            200 on successful delete, 404 if not found
    """
    rtnd_event = collection.find({"_id": ObjectId(event_id)})
    # Can we insert this event?
    if len(list(rtnd_event.clone())) != 0:
        collection.delete_one({"_id": ObjectId(event_id)})

    # Otherwise, nope, didn't find that person
    else:
        abort(
            404,
            "event not found for Id: {event_id}".format(event_id=event_id),
        )
