"""
This is the processes module and supports all the REST actions for the
processes data
"""

from flask import request, make_response, abort, g
from bson.json_util import dumps
from bson.objectid import ObjectId
import json
from app import app
from ddb import client


db = client.ContactDB
collection = db.processes


@app.route('/site_maps/<string:map_id>/processes', methods=['GET'])
def processes_read_all(map_id):
    """
    This function responds to a request for /api/processes
    with the complete lists of processes

    :return:        json string of list of processes
    """
    # Create the list of processes from our data
    processes = collection.find({'map_id': map_id})
    return dumps(processes)


@app.route('/processes/<string:process_id>', methods=['GET'])
def processes_read_one(process_id):
    """
    This function responds to a request for /api/processes/{process_id}
    with one matching process from processes

    :param process_id:   Id of process to find
    :return:            process matching id
    """
    # Create the list of processes from our data
    process = collection.find_one({"_id": process_id})
    if process:
        return dumps(process)
    # Otherwise, nope, didn't find that process
    else:
        abort(
            404,
            "process not found for Id: {process_id}".format(
                process_id=process_id),
        )


@app.route('/processes', methods=['POST'])
def processes_create():
    """
    This function creates a new process in the processes structure
    based on the passed in process data

    :param process:  process to create in processes structure
    :return:        201 on success, 406 on process exists
    """
    process = request.get_json()
    result = collection.insert_one(process)
    process_with_id = collection.find_one({'_id': result.inserted_id})
    # g.socket.emit('message', {"type": "processes", "method": "POST",
    #               "payload": process_with_id}, broadcast=True)
    return dumps(process_with_id)


@app.route('/processes/<string:process_id>', methods=['PUT'])
def processes_update(process_id):
    """
    This function updates an existing process in the processes structure
    Throws an error if a process with the name we want to update to
    already exists in the database.

    :param process_id:   Id of the process to update in the processes structure
    :param process:      process to update
    :return:            updated process structure
    """
    process = request.get_json()
    # Are we trying to find a process that does not exist?
    rtn_process_1 = list(collection.find({"_id": process_id}))
    if len(rtn_process_1) == 0:
        abort(
            404,
            "process not found for Id: {process_id}".format(
                process_id=process_id),
        )

    # # Would our update create a duplicate of another process already existing?
    # rtn_process_2 = list(collection.find({"name":process["name"]}))
    # if len(rtn_process_2) != 0 and rtn_process_2['_id'] != rtn_process_1['_id'] :
    #     abort(
    #         409,
    #         "process {name} exists already".format(
    #             name=process["name"]
    #         ),
    #     )

    result = collection.replace_one({"_id": process_id}, process)
    process_with_id = collection.find_one({"_id": process_id})

    # Cleanup routes that are no longer used
    process_routes = list(db.tasks.find({'processId': process_with_id['_id']}))
    for route in process_routes:
        if route['_id'] not in process_with_id['routes']:
            db.tasks.delete_one({'_id': route['_id']})

    # g.socket.emit('message', {"type": "processes", "method": "PUT",
    #               "payload": process_with_id}, broadcast=True)
    return dumps(process_with_id)


@app.route('/processes/<string:process_id>', methods=['DELETE'])
def processes_delete(process_id):
    """
    This function deletes a process from the processes structure

    :param process_id:   Id of the process to delete
    :return:            200 on successful delete, 404 if not found
    """
    rtnd_process = collection.find({"_id": process_id})
    # Can we insert this process?
    if len(list(rtnd_process.clone())) != 0:
        collection.delete_one({"_id": process_id})
        # g.socket.emit('message', {
        #               "type": "processes", "method": "DELETE", "payload": process_id}, broadcast=True)
        return process_id

    # Otherwise, nope, didn't find that person
    else:
        abort(
            404,
            "process not found for Id: {process_id}".format(
                process_id=process_id),
        )
