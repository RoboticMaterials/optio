"""
This is the position module and supports all the REST actions for the
position data
"""

from flask import make_response, abort
from bson.json_util import dumps
from bson.objectid import ObjectId
from pymongo import MongoClient

client = MongoClient('localhost:27017')
db = client.ContactDB
collection = db.positions

# collection.delete_many({})


def read_all():
    """
    This function responds to a request for /api/positions
    with the complete lists of positions

    :return:        json string of list of positions
    """
    # Create the list of positions from our data
    positions = collection.find()
    return dumps(positions)


def read_one(position_id):
    """
    This function responds to a request for /api/positions/{position_id}
    with one matching position from positions

    :param position_id:   Id of position to find
    :return:            position matching id
    """
    # Create the list of positions from our data
    position = collection.find({"_id":position_id})
    if len(list(position.clone())) != 0:
        return dumps(position)
    # Otherwise, nope, didn't find that position 
    else:
        abort(
            404,
            "Position not found for Id: {position_id}".format(position_id=position_id),
        )


def create(position):
    """
    This function creates a new position in the positions structure
    based on the passed in position data

    :param position:  position to create in positions structure
    :return:        201 on success, 406 on position exists
    """

    result = collection.insert_one(position)
    position_with_id = collection.find_one({'_id':result.inserted_id})
    return dumps(position_with_id)

# def update(position_id, position):
#     """
#     This function updates an existing position in the positions structure
#     Throws an error if a position with the name we want to update to
#     already exists in the database.

#     :param position_id:   Id of the position to update in the positions structure
#     :param position:      position to update
#     :return:            updated position structure
#     """
#     # Get the position requested from the db into session
#     update_position = Position.query.filter(
#         Position.position_id == position_id
#     ).one_or_none()

#     # Try to find an existing position with the same name as the update
#     fname = position.get("fname")
#     lname = position.get("lname")

#     existing_position = (
#         Position.query.filter(Position.fname == fname)
#         .filter(Position.lname == lname)
#         .one_or_none()
#     )

#     # Are we trying to find a position that does not exist?
#     if update_position is None:
#         abort(
#             404,
#             "Position not found for Id: {position_id}".format(position_id=position_id),
#         )

#     # Would our update create a duplicate of another position already existing?
#     elif (
#         existing_position is not None and existing_position.position_id != position_id
#     ):
#         abort(
#             409,
#             "Position {fname} {lname} exists already".format(
#                 fname=fname, lname=lname
#             ),
#         )

#     # Otherwise go ahead and update!
#     else:

#         # turn the passed in position into a db object
#         schema = PositionSchema()
#         update = schema.load(position, session=db.session)

#         # Set the id to the position we want to update
#         update.position_id = update_position.position_id

#         # merge the new object into the old and commit it to the db
#         db.session.merge(update)
#         db.session.commit()

#         # return updated position in the response
#         data = schema.dump(update_position)

#         return data, 200

def update(position_id, position):
    """
    This function updates an existing dashboard in the dashboards structure
    Throws an error if a dashboard with the name we want to update to
    already exists in the database.

    :param dashboard_id:   Id of the dashboard to update in the dashboards structure
    :param dashboard:      dashboard to update
    :return:            updated dashboard structure
    """

    # Are we trying to find a dashboard that does not exist?
    rtn_position_1 = list(collection.find({"_id":position_id}))
    if len(rtn_position_1) == 0:
        abort(
            404,
            "Position not found for Id: {position_id}".format(position_id=position_id),
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

    result = collection.replace_one({"_id":position_id}, position)
    position_with_id = collection.find_one({"_id":position_id})
    return dumps(position_with_id)


def delete(position_id):
    """
    This function deletes a position from the positions structure

    :param position_id:   Id of the position to delete
    :return:            200 on successful delete, 404 if not found
    """
    rtnd_position = collection.find({"_id":position_id})
    # Can we insert this position?
    if len(list(rtnd_position.clone())) != 0:
        collection.delete_one({"_id":position_id})

    # Otherwise, nope, didn't find that person
    else:
        abort(
            404,
            "Position not found for Id: {position_id}".format(position_id=position_id),
        )
