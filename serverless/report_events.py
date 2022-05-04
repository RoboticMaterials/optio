"""
This is the schedule module and supports all the REST actions for the
schedule data
"""

from flask import request, make_response, abort
from bson.json_util import dumps
from bson.objectid import ObjectId
from datetime import datetime
import uuid
from app import app
from ddb import client


db = client.ContactDB
collection = db.report_events

# Report Events
#     {
#         date,
#         station_id,
#         dashboard_id,
#         report_id
#     }


@app.route('/report_events', methods=['GET'])
def report_events_read_all():
    """
    This function responds to a request for /api/report_events
    with the complete lists of report_events

    :return:        json string of list of report_events
    """
    # Create the list of report_events from our data
    report_events = collection.find()
    return dumps(report_events)


@app.route('/report_events/<string:report_event_id>', methods=['GET'])
def report_events_read_one(report_event_id):
    """
    This function responds to a request for /api/report_events/{report_event_id}
    with one matching report_event from report_events

    :param report_event_id:   Id of report_event to find
    :return:            report_event matching id
    """
    # Get the report_event from our data
    report_event = collection.find_one({"_id": report_event_id})

    if report_event:
        return dumps(report_event)

    # Otherwise, nope, didn't find that report_event
    else:
        abort(
            404,
            "Report Event not found for Id: {report_event_id}".format(
                report_event_id=report_event_id),
        )


@app.route('/report_events', methods=['POST'])
def report_events_create():
    """
    This function creates a new report_event in the report_events structure
    based on the passed in report_event data

    :param report_event:  report_event to create in report_events structure
    :return:        201 on success, 406 on report_event exists
    """
    report_event = request.get_json()
    # add id field
    id = str(ObjectId())
    report_event['_id'] = id

    # make sure report_event contains button_id
    report_button_id = report_event['report_button_id']
    if not report_button_id:
        abort(
            400,
            "Report button ID was not provided"
        )

    # check if a report_event already exists for this button_id
    existing_report_event = collection.find_one({'_id': id})
    if existing_report_event is not None:
        abort(
            400,
            "Report event already exists: {id}".format(id=id),
        )

    # add to collection
    report_event['datetime'] = datetime.fromtimestamp(
        report_event['datetime'] / 1000)
    result = collection.insert_one(report_event)

    report_event_with_id = collection.find_one({'_id': result.inserted_id})

    return dumps(report_event_with_id)


@app.route('/report_events/<string:report_event_id>', methods=['PUT'])
def report_events_update(report_event_id):
    """
    This function updates an existing report_event in the report_events structure
    Throws an error if a report_event with the name we want to update to
    already exists in the database.

    :param report_event_id:   Id of the report_event to update in the report_events structure
    :param report_event:      report_event to update
    :return:            updated report_event structure
    """
    report_event = request.get_json()
    # check for existing report_event
    old_report_event = collection.find_one({"_id": report_event_id})

    # Are we trying to update a report_event that does not exist?
    if old_report_event is None:
        abort(
            404,
            "Report event not found for Id: {report_event_id}".format(
                report_event_id=report_event_id),
        )

    # Otherwise go ahead and update!
    else:
        result = collection.replace_one(
            {"_id": (report_event_id)}, report_event)
        report_event_with_id = collection.find_one({"_id": (report_event_id)})
        return dumps(report_event_with_id)


@app.route('/report_events/<string:report_event_id>', methods=['DELETE'])
def report_events_delete(report_event_id):
    """
    This function deletes a report_event from the report_events structure

    :param report_event_id:   Id of the report_event to delete
    :return:            200 on successful delete, 404 if not found
    """
    rtnd = collection.find({"_id": (report_event_id)})
    # does a report_event with a matching id exist?
    if len(list(rtnd.clone())) != 0:
        collection.delete_one({"_id": (report_event_id)})

    # Otherwise, nope, didn't find that
    else:
        abort(
            404,
            "Report Event not found for Id: {report_event_id}".format(
                report_event_id=report_event_id),
        )
