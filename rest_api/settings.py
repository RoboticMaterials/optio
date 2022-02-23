"""
This is the settings module and supports all the REST actions for the
settings data
"""

from flask import make_response, abort
from bson.json_util import dumps
from bson.objectid import ObjectId
from pymongo import MongoClient

client = MongoClient('localhost:27017')
db = client.ContactDB
collection = db.settings

# If settings dont exists, insert them
if db.settings.count_documents({}) < 1:
    db.settings.insert_one({
    "currentMapId": None,
    "loggers": {
      "Dashboards": False,
      "Scheduler": False,
      "Tasks": False,
      "Objects": False,
      "ModelViewer": False,
      "Api": False,
      "ReduxLogger": False,
      "All": False
    },
    "shiftDetails": {
      "startOfShift": "09:00",
      "endOfShift": "17:00",
      "expectedOutput": None,
      "breaks": {
        "break1": {
          "enabled": False,
          "startOfBreak": "08:30",
          "endOfBreak": "9:00"
        },
        "break2": {
          "enabled": False,
          "startOfBreak": "11:00",
          "endOfBreak": "12:00"
        },
        "break3": {
          "enabled": False,
          "startOfBreak": "13:00",
          "endOfBreak": "14:00"
        }
      }
    },
    "mapApps": {
      "heatmap": True,
      "ratsnest": True,
      "labels": True
    },
    "enableMultipleLotFilters": False,
    "timezone": {
      "name": "(Mountain Time) Denver",
      "label": "America/Denver"
    },
    "MiRMapEnabled": False,
    "authenticated": False,
    "deviceEnabled": False,
    "mapViewEnabled": True,
    "non_local_api": False,
    "non_local_api_ip": "localhost",
    "toggleDevOptions": False,
    "stationBasedLots": True,
    "moveAlertDuration": 3000,
    "trackUsers": False,
    "emailAddress": "",
    "emailEnabled": False,
    "emailName": "",
    "hideFilterSortDashboards": False,
    "fractionMove": False,
    "alpenParse": None,
    "lotSummaryFilterOption": {
      "label": "Name",
      "fieldName": "name",
      "primary": True,
      "dataType": "STRING"
    },
    "lotSummaryFilterValue": "",
    "lotSummarySortDirection": {
      "color": "#db2100",
      "id": 0,
      "iconClassName": "fas fa-arrow-up"
    },
    "lotSummarySortValue": {
      "label": "Name",
      "fieldName": "name",
      "primary": True,
      "dataType": "STRING"
    },
    "orderedCardIds": {},
    "defaultMapId": None,
    "lastUsedMap": None
  })

def read_all():
    """
    This function responds to a request for /api/settings
    with the complete lists of settings

    :return:        json string of list of settings
    """
    # Create the list of settings from our data
    settings = collection.find_one()
    return dumps(settings)

def create(settings):
    """
    This function creates a new settings in the settings structure
    based on the passed in settings data

    :param settings:  settings to create in settings structure
    :return:        201 on success, 406 on settings exists
    """
    mongo_settings = collection.find()
    if len(list(mongo_settings)) == 0:
        collection.insert_one({})
    collection.update_one({},  { "$set": settings})
    return 201


 