"""
This is the dashboard module and supports all the REST actions for the
dashboard data
"""

from flask import request, make_response, abort, g
from bson.json_util import dumps
from bson.objectid import ObjectId
import json
from app import app
from ddb import client

db = client.ContactDB
collection = db.dashboards

# collection.delete_many({})


@app.route('/site_maps/<string:map_id>/dashboards', methods=['GET'])
def dashboards_read_all(map_id):
    """
    This function responds to a request for /api/dashboards
    with the complete lists of dashboards

    :return:        json string of list of dashboards
    """
    # Create the list of dashboards from our data
    dashboards = collection.find({'map_id': map_id})
    return dumps(dashboards)


@app.route('/site_maps/<string:dashboard_id>', methods=['GET'])
def dashboards_read_one(dashboard_id):
    """
    This function responds to a request for /api/dashboards/{dashboard_id}
    with one matching dashboard from dashboards

    :param dashboard_id:   Id of dashboard to find
    :return:            dashboard matching id
    """
    # Create the list of dashboards from our data
    dashboard = collection.find_one({"_id": ObjectId(dashboard_id)})
    if dashboard:
        return dumps(dashboard)
    # Otherwise, nope, didn't find that dashboard
    else:
        abort(
            404,
            "Dashboard not found for Id: {dashboard_id}".format(
                dashboard_id=dashboard_id),
        )


@app.route('/dashboards', methods=['POST'])
def dashboards_create():
    """
    This function creates a new dashboard in the dashboards structure
    based on the passed in dashboard data

    :param dashboard:  dashboard to create in dashboards structure
    :return:        201 on success, 406 on dashboard exists
    """
    dashboard = request.get_json()
    rtnd_dashboard = collection.find({"name": dashboard["name"]})
    # Can we insert this dashboard?
    # if rtnd_dashboard.count() == 0:
    result = collection.insert_one(dashboard)
    dashboard_with_id = collection.find_one({'_id': result.inserted_id})
    dashboard_with_id['_id'] = {"$oid": str(dashboard_with_id['_id'])}
    # g.socket.emit('message', {"type": "dashboards", "method": "POST",
    #               "payload": dashboard_with_id}, broadcast=True)
    return dumps(dashboard_with_id)


@app.route('/dashboards/<string:dashboard_id>', methods=['PUT'])
def dashboards_update(dashboard_id):
    """
    This function updates an existing dashboard in the dashboards structure
    Throws an error if a dashboard with the name we want to update to
    already exists in the database.

    :param dashboard_id:   Id of the dashboard to update in the dashboards structure
    :param dashboard:      dashboard to update
    :return:            updated dashboard structure
    """

    dashboard = request.get_json()
    # Are we trying to find a dashboard that does not exist?
    rtn_dashboard_1 = list(collection.find({"_id": ObjectId(dashboard_id)}))
    if len(rtn_dashboard_1) == 0:
        abort(
            404,
            "Dashboard not found for Id: {dashboard_id}".format(
                dashboard_id=dashboard_id),
        )

    # # Would our update create a duplicate of another dashboard already existing?
    # rtn_dashboard_2 = list(collection.find({"name":dashboard["name"]}))
    # if len(rtn_dashboard_2) != 0 and rtn_dashboard_2['_id'] != rtn_dashboard_1['_id'] :
    #     abort(
    #         409,
    #         "Dashboard {name} exists already".format(
    #             name=dashboard["name"]
    #         ),
    #     )

    result = collection.replace_one({"_id": ObjectId(dashboard_id)}, dashboard)
    dashboard_with_id = collection.find_one({"_id": ObjectId(dashboard_id)})
    dashboard_with_id['_id'] = {"$oid": str(dashboard_with_id['_id'])}
    # g.socket.emit('message', {"type": "dashboards", "method": "PUT",
    #               "payload": dashboard_with_id}, broadcast=True)
    return dumps(dashboard_with_id)


@app.route('/dashboards/<string:dashboard_id>', methods=['DELETE'])
def dashboards_delete(dashboard_id):
    """
    This function deletes a dashboard from the dashboards structure

    :param dashboard_id:   Id of the dashboard to delete
    :return:            200 on successful delete, 404 if not found
    """
    rtnd_dashboard = collection.find({"_id": ObjectId(dashboard_id)})
    # Can we insert this dashboard?
    if len(list(rtnd_dashboard.clone())) != 0:
        collection.delete_one({"_id": ObjectId(dashboard_id)})
        # g.socket.emit('message', {
        #               "type": "dashboards", "method": "DELETE", "payload": dashboard_id}, broadcast=True)
        return dashboard_id

    # Otherwise, nope, didn't find that person
    else:
        abort(
            404,
            "Dashboard not found for Id: {dashboard_id}".format(
                dashboard_id=dashboard_id),
        )
