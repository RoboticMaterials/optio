"""
This is the status module and supports all the REST actions for the
status data
"""

from flask import make_response, abort
from bson.json_util import dumps
from bson.objectid import ObjectId
from pymongo import MongoClient

client = MongoClient('localhost:27017')
db = client.ContactDB
collection = db.status

def read_all():
    """
    This function responds to a request for /api/status
    with the complete lists of status

    :return:        json string of list of status
    """
    # Create the list of status from our data
    status = collection.find_one()
    return dumps(status)

def create(status):
    """
    This function creates a new status in the status structure
    based on the passed in status data

    :param status:  status to create in status structure
    :return:        201 on success, 406 on status exists
    """
    collection.update_one({},  { "$set": status})
    return 201


 