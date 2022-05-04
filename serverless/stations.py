"""
This is the station module and supports all the REST actions for the
station data
"""

from flask import request, make_response, abort, g
from bson.json_util import dumps
from bson.objectid import ObjectId
from app import app
from ddb import client


db = client.ContactDB
collection = db.stations

# collection.delete_many({})


@app.route('/site_maps/<string:map_id>/stations', methods=['GET'])
def stations_read_all(map_id):
    """
    This function responds to a request for /api/stations
    with the complete lists of stations

    :return:        json string of list of stations
    """
    # Create the list of stations from our data
    stations = collection.find({'map_id': map_id})
    return dumps(stations)


@app.route('/stations/<string:station_id>', methods=['GET'])
def stations_read_one(station_id):
    """
    This function responds to a request for /api/stations/{station_id}
    with one matching station from stations

    :param station_id:   Id of station to find
    :return:            station matching id
    """
    # Create the list of stations from our data
    station = collection.find_one({"_id": station_id})
    if station:
        return dumps(station)
    # Otherwise, nope, didn't find that station
    else:
        abort(
            404,
            "station not found for Id: {station_id}".format(
                station_id=station_id),
        )


@app.route('/stations', methods=['POST'])
def stations_create():
    """
    This function creates a new station in the stations structure
    based on the passed in station data

    :param station:  station to create in stations structure
    :return:        201 on success, 406 on station exists
    """
    station = request.get_json()
    rtnd_station = collection.find(
        {"$and": [{"name": station["name"]}, {"map_id": station["map_id"]}]})
    # Can we insert this station?
    # if rtnd_station.count() == 0:
    if len(list(rtnd_station.clone())) == 0:
        result = collection.insert_one(station)
        station_with_id = collection.find_one({'_id': result.inserted_id})
        # g.socket.emit('message', {
        #               "type": "stations", "method": "POST", "payload": station_with_id}, broadcast=True)
        return dumps(station_with_id)

    # Otherwise, nope, station exists already
    else:
        abort(
            409,
            "station {name} exists already".format(
                name=station["name"]
            ),
        )


# def update(station_id, station):
#     """
#     This function updates an existing station in the stations structure
#     Throws an error if a station with the name we want to update to
#     already exists in the database.

#     :param station_id:   Id of the station to update in the stations structure
#     :param station:      station to update
#     :return:            updated station structure
#     """
#     # Get the station requested from the db into session
#     update_station = station.query.filter(
#         station.station_id == station_id
#     ).one_or_none()

#     # Try to find an existing station with the same name as the update
#     fname = station.get("fname")
#     lname = station.get("lname")

#     existing_station = (
#         station.query.filter(station.fname == fname)
#         .filter(station.lname == lname)
#         .one_or_none()
#     )

#     # Are we trying to find a station that does not exist?
#     if update_station is None:
#         abort(
#             404,
#             "station not found for Id: {station_id}".format(station_id=station_id),
#         )

#     # Would our update create a duplicate of another station already existing?
#     elif (
#         existing_station is not None and existing_station.station_id != station_id
#     ):
#         abort(
#             409,
#             "station {fname} {lname} exists already".format(
#                 fname=fname, lname=lname
#             ),
#         )

#     # Otherwise go ahead and update!
#     else:

#         # turn the passed in station into a db object
#         schema = stationSchema()
#         update = schema.load(station, session=db.session)

#         # Set the id to the station we want to update
#         update.station_id = update_station.station_id

#         # merge the new object into the old and commit it to the db
#         db.session.merge(update)
#         db.session.commit()

#         # return updated station in the response
#         data = schema.dump(update_station)

#         return data, 200


@app.route('/stations/<string:station_id>', methods=['PUT'])
def stations_update(station_id):
    """
    This function updates an existing dashboard in the dashboards structure
    Throws an error if a dashboard with the name we want to update to
    already exists in the database.

    :param dashboard_id:   Id of the dashboard to update in the dashboards structure
    :param dashboard:      dashboard to update
    :return:            updated dashboard structure
    """
    station = request.get_json()
    # Are we trying to find a dashboard that does not exist?
    rtn_station_1 = list(collection.find({"_id": station_id}))
    if len(rtn_station_1) == 0:
        abort(
            404,
            "station not found for Id: {station_id}".format(
                station_id=station_id),
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

    result = collection.replace_one({"_id": station_id}, station)
    station_with_id = collection.find_one({"_id": station_id})
    # g.socket.emit('message', {"type": "station", "method": "PUT",
    #               "payload": station_with_id}, broadcast=True)
    return dumps(station_with_id)


@app.route('/stations/<string:station_id>', methods=['DELETE'])
def stations_delete(station_id):
    """
    This function deletes a station from the stations structure

    :param station_id:   Id of the station to delete
    :return:            200 on successful delete, 404 if not found
    """
    rtnd_station = collection.find({"_id": station_id})
    # Can we delete  this station?
    if len(list(rtnd_station.clone())) != 0:
        collection.delete_one({"_id": station_id})
        # g.socket.emit('message', {
        #               "type": "station", "method": "DELETE", "payload": station_id}, broadcast=True)
        return station_id

    # Otherwise, nope, didn't find that person
    else:
        abort(
            404,
            "station not found for Id: {station_id}".format(
                station_id=station_id),
        )
