"""
This is the site_map module and supports all the REST actions for the
site_map data
"""

from flask import request, make_response, abort
from bson.json_util import dumps
from bson.objectid import ObjectId
from app import app
from ddb import client

import json


db = client.ContactDB
collection = db.site_maps


@app.route('/site_maps', methods=['GET'])
def site_maps_read_all():
    """
    This function responds to a request for /api/site_maps
    with the complete lists of site_maps

    :return:        json string of list of site_maps
    """
    # Create the list of site_maps from our data
    site_maps = collection.find()
    return dumps(site_maps)

    # return dumps([
    #     {
    #         "url": "string",
    #         "guid": "51131f98-bfb5-11ea-a742-94c691a739e9",
    #         "name": "Robotic Materials"
    #     }
    # ])

@app.route('/site_maps/<string:site_map_id>', methods=['GET'])
def site_maps_read_one(site_map_id):
    """
    This function responds to a request for /api/site_maps/{site_map_id}
    with one matching site_map from site_maps

    :param site_map_id:   Id of site_map to find
    :return:            site_map matching id
    """
    # Create the list of site_maps from our data
    site_map = collection.find_one({"_id": site_map_id})
    if site_map:
        return dumps(site_map)

    else:  # Otherwise, nope, didn't find that site_map
        abort(
            404,
            "Site Map not found for Id: {site_map_id}".format(
                site_map_id=site_map_id),
        )


@app.route('/site_map', methods=['POST'])
def site_maps_create():
    """
    This function creates a new site_map in the site_maps structure
    based on the passed in site_map data

    :param site_map:  site_map to create in site_maps structure
    :return:        201 on success, 406 on site_map exists
    """
    site_map = request.get_json()
    rtnd_site_map = collection.find({"name": site_map["name"]})
    # Can we insert this site_map?
    if len(list(rtnd_site_map.clone())) == 0:
        collection.insert_one(site_map)
        return 201

    # Otherwise, nope, site_map exists already
    else:
        abort(
            409,
            "Site Map {name} exists already".format(
                name=site_map["name"]
            ),
        )


@app.route('/site_maps/<string:map_id>', methods=['PUT'])
def site_maps_update(site_map_id):
    """
    This function updates an existing site_map in the site_maps structure
    Throws an error if a site_map with the name we want to update to
    already exists in the database.

    :param site_map_id:   Id of the site_map to update in the site_maps structure
    :param site_map:      site_map to update
    :return:            updated site_map structure
    """
    site_map = request.get_json()
#     # Get the site_map requested from the db into session
#     update_site_map = Site Map.query.filter(
#         Site Map.site_map_id == site_map_id
#     ).one_or_none()

#     # Try to find an existing site_map with the same name as the update
#     fname = site_map.get("fname")
#     lname = site_map.get("lname")

#     existing_site_map = (
#         Site Map.query.filter(Site Map.fname == fname)
#         .filter(Site Map.lname == lname)
#         .one_or_none()
#     )

#     # Are we trying to find a site_map that does not exist?
#     if update_site_map is None:
#         abort(
#             404,
#             "Site Map not found for Id: {site_map_id}".format(site_map_id=site_map_id),
#         )

#     # Would our update create a duplicate of another site_map already existing?
#     elif (
#         existing_site_map is not None and existing_site_map.site_map_id != site_map_id
#     ):
#         abort(
#             409,
#             "Site Map {fname} {lname} exists already".format(
#                 fname=fname, lname=lname
#             ),
#         )

#     # Otherwise go ahead and update!
#     else:

#         # turn the passed in site_map into a db object
#         schema = Site MapSchema()
#         update = schema.load(site_map, session=db.session)

#         # Set the id to the site_map we want to update
#         update.site_map_id = update_site_map.site_map_id

#         # merge the new object into the old and commit it to the db
#         db.session.merge(update)
#         db.session.commit()

#         # return updated site_map in the response
#         data = schema.dump(update_site_map)

#         return data, 200


@app.route('/site_maps/<string:site_map_id>', methods=['DELETE'])
def site_maps_delete(site_map_id):
    """
    This function deletes a site_map from the site_maps structure

    :param site_map_id:   Id of the site_map to delete
    :return:            200 on successful delete, 404 if not found
    """
    rtnd_site_map = collection.find({"_id": site_map_id})
    # Can we insert this site_map?
    if len(list(rtnd_site_map.clone())) != 0:
        collection.delete_one({"_id": site_map_id})

    # Otherwise, nope, didn't find that person
    else:
        abort(
            404,
            "Site Map not found for Id: {site_map_id}".format(
                site_map_id=site_map_id),
        )
