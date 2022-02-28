from flask import make_response, abort
from bson.json_util import dumps, loads
from bson.objectid import ObjectId
from pymongo import MongoClient
from pprint import pprint
import warnings
import numpy as np
import pandas as pd
import uuid
import threading
import operator
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

from constants import PANDORA_PRICE_PER, PANDORA_PRICE_FIXED

client = MongoClient('localhost:27017')
db = client.ContactDB

def round_time(dt=None, delta=timedelta(minutes=1), to='average'):
    """
    Round a datetime object to a multiple of a timedelta
    dt : datetime.datetime object, default now.
    dateDelta : timedelta object, we round to a multiple of this, default 1 minute.
    from:  http://stackoverflow.com/questions/3463930/how-to-round-the-minute-of-a-datetime-object-python
    """
    minDt = datetime.now().replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)  
    
    round_to = delta.total_seconds()
    if dt is None:
        dt = datetime.now()
    seconds = (dt - minDt).seconds

    if seconds % round_to == 0 and dt.microsecond == 0:
        rounding = (seconds + round_to / 2) // round_to * round_to
    else:
        if to == 'ceil':
            # // is a floor division, not a comment on following line (like in javascript):
            rounding = (seconds + dt.microsecond/1000000 + round_to) // round_to * round_to
        elif to == 'floor':
            rounding = seconds // round_to * round_to
        else:
            rounding = (seconds + round_to / 2) // round_to * round_to

    return dt + timedelta(0, rounding - seconds, - dt.microsecond)

def generate_next_summary(collection, summary_period, current_dateTime=None):
    ## Generate the next summary for a certain time period
    
    if current_dateTime is None:
        current_dateTime = datetime.now()
        
    # Get latest summary dateTime
    summary_cursor = list(collection.find({}).sort([("_id",-1)]).limit(1))
    if len(summary_cursor) == 0:
        # No current summary entries, use first event as latest datetime
        all_events = list(db.pour_events.find({}).sort([("_id",-1)]))
        latest_summary_dateTime = all_events[-1]['dateTime']
    else:
        latest_summary_dateTime = summary_cursor[0]['dateTime']
        
    # floor the most recent datetime to summary perioud
    floored_latest_summary_dateTime = round_time(latest_summary_dateTime, delta=summary_period, to='floor')
    # Cutoff for next summary is the previous floored summary datetime + the delta
    next_summary_dateTime = floored_latest_summary_dateTime + summary_period
        
    if current_dateTime > next_summary_dateTime:  # If last summary was more then the summary period ago, make a new summary

        ## Time to generate new summary
        # Gets all events in the 6hr period following the most recent summary
        next_events = db.pour_events.find({
            '$and': [
                {'dateTime': {'$gt': latest_summary_dateTime}},
                {'dateTime': {'$lte': next_summary_dateTime}}
            ]
        })

        return summarize_events(next_events, next_summary_dateTime)

    else:   # Otherwise there is no new summary, return None
        return None

def day_historical_summaries(current_dateTime=None):
     # summarize all 10min summaries to catch up to current date
    summary = generate_next_summary(db.historicals_day, timedelta(days=1), current_dateTime)
    while summary is not None:
        db.historicals_day.insert_one(summary)
        summary = generate_next_summary(db.historicals_day, timedelta(days=1), current_dateTime)