# You can access the following resource attributes as environment variables from your Lambda function
#         API_RMSTUDIOCLOUD_GRAPHQLAPIENDPOINTOUTPUT
#         API_RMSTUDIOCLOUD_GRAPHQLAPIIDOUTPUT
#         API_RMSTUDIOCLOUD_ORGANIZATIONTABLE_ARN
#         API_RMSTUDIOCLOUD_ORGANIZATIONTABLE_NAME
#         API_RMSTUDIOCLOUD_STATIONEVENTTABLE_ARN
#         API_RMSTUDIOCLOUD_STATIONEVENTTABLE_NAME
#         API_RMSTUDIOCLOUD_STATIONTABLE_ARN
#         API_RMSTUDIOCLOUD_STATIONTABLE_NAME
#         API_RMSTUDIOCLOUD_USERTABLE_ARN
#         API_RMSTUDIOCLOUD_USERTABLE_NAME
#         AUTH_RMSTUDIOCLOUD298656C6_USERPOOLID
#         ENV
#         REGION

import json
import os
from pprint import pprint

import boto3
from boto3.dynamodb.conditions import Key

# Analysis Imports
import pandas as pd
import numpy as np
import time
import datetime 
import pytz

# set time zone
tz = pytz.timezone('America/Denver')

# create dynamo class
dynamodb = boto3.resource('dynamodb', region_name=os.environ['REGION'])

# table def parameters of events for stations
table = dynamodb.Table(os.environ['API_RMSTUDIOCLOUD_STATIONEVENTTABLE_NAME'])

def handler(event, context):

    # define varibles coming from putside this function
    env = os.environ
    arguments = event['arguments']

    info = {}

    info['index'] = arguments['index']

    info['timespan'] = arguments['timeSpan']

    station_id = arguments['station_id']

    output = False

    calculated_data = get_stats(station_id, info,  output)

    return {
        'date': calculated_data['date_title'],
        'organizationId': 'orgId',
        'stationId': arguments['station_id'],
        'throughPut': calculated_data['throughPut']
    }

# Analytics functions
def get_stats(station_id, info, output=False):

    data = {}

    if info['timespan'] == 'day':
        data['throughPut'], data['date_title'] = calc_day_stats(station_id,  index=info['index'], output=output)
    elif info['timespan'] == 'line':
        data['throughPut'], data['date_title'] = calc_day_line_stats(station_id,  index=info['index'])
    elif info['timespan'] == 'week':
        data['throughPut'], data['date_title'] = calc_week_stats(station_id,  index=info['index'], output=output)
    elif info['timespan'] == 'month':
        data['throughPut'], data['date_title'] = calc_6_week_stats(station_id,  index=info['index'], output=output)
    else:
        data['throughPut'], data['date_title'] = calc_year_stats(station_id,  index=info['index'], output=output)
    
    return data

def create_data(station_id, start_utc, end_utc, labels, output=False):

    # Create bins for data
    bins = np.linspace(start_utc, end_utc, len(labels)+1)

    station_events_response = table.scan(
        FilterExpression=Key('station').eq(station_id)
    )

    events_data = station_events_response['Items']

    # Fetch data
    # TODO only fetch data from time frame to make scalable
    df = pd.DataFrame(list(events_data))

    df.time = df.time.astype(float)

    if len(df) > 0:

        df = df.set_index('time')

        # Crop data
        df = df[start_utc : end_utc]

        # Find unique ids
        unique_ids = df[start_utc : end_utc]['object'].unique()
        # Bin data for each unique id
        data_dict = {}

        for object_id in unique_ids:
            if object_id is None:
                df_1 = df[df['object'].isnull().values]
            else:
                df_1 = df[df['object'] == object_id]

            times = df_1.index.repeat(df_1['quantity'])
            data, edges = np.histogram(times, bins)
            data_dict[object_id] = data
            
            # Output graph
            if len(times) > -1 and output:
                print('Data', data)
                plt.figure(figsize=(30,10))
                plt.bar(labels, data, color='green')
                plt.show()

        # Format data for frontend
        rtn_data = []
        for i, lable in enumerate(labels):
            temp_dict = {'lable':lable}
            for object_id in unique_ids:
                temp_dict[object_id] = int(data_dict[object_id][i])

            rtn_data.append(temp_dict) 
    else:
        rtn_data = []
        
    return rtn_data

def calc_day_stats(station_id,  index, output=False):
    current_dt = datetime.datetime.now(tz)
    start_of_today = current_dt.replace(hour=0, minute=0, second=0, microsecond=0)
    start_of_time_frame = start_of_today + datetime.timedelta(days=-index, hours=0, minutes=0, seconds=0, microseconds=0)
    end_of_time_frame = start_of_time_frame + datetime.timedelta(days=1, hours=0, minutes=0, seconds=0, microseconds=0)
    date_title = start_of_time_frame.strftime("%B %d, %Y")

    start_utc = datetime.datetime.timestamp(start_of_time_frame)
    end_utc = datetime.datetime.timestamp(end_of_time_frame)
    
    fmt = "%Y-%m-%d %H:%M:%S %Z%z"
    print('Start Time Day', start_of_time_frame.strftime(fmt))
    print('End Time Day', end_of_time_frame.strftime(fmt))
    
    date_title = start_of_time_frame.strftime("%B %d, %Y")
    
    labels = ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm']
    
    if output:
        print('Start', start_of_time_frame)
        print('End', end_of_time_frame)
        print('Title', date_title)

    rtn_data = create_data(station_id, start_utc, end_utc, labels, output=output)

    return rtn_data, date_title

def calc_day_line_stats(station_id, index=0):
    # scan and filter data
    station_events_response = table.scan(
        FilterExpression=Key('station').eq(station_id)
    )

    # Pull data out
    events_data = station_events_response['Items']

    # Get station events
    events = list(events_data)

    num_of_events = len(events)
    
    # Split list to outgoing events
    outgoing_events = []
    for event in events:
        if event['outgoing'] == True:
            outgoing_events.append(event)
    
    current_dt = datetime.datetime.now(tz)
    start_of_today = current_dt.replace(hour=0, minute=0, second=0, microsecond=0)
    start_of_time_frame = start_of_today + datetime.timedelta(days=-index, hours=0, minutes=0, seconds=0, microseconds=0)
    end_of_time_frame = start_of_time_frame + datetime.timedelta(days=1, hours=0, minutes=0, seconds=0, microseconds=0)
    date_title = start_of_time_frame.strftime("%B %d, %Y")
    
    start_utc = datetime.datetime.timestamp(start_of_time_frame)
    end_utc = datetime.datetime.timestamp(end_of_time_frame)
    
    # Plot outgoing events
    rtn_data = []
    for event in events:
        if start_utc < event['time'] and event['time'] < end_utc:
            rtn_data.append({'x': float(event['time']), 'y': int(event['quantity']) })

    return rtn_data, date_title


def calc_week_stats(station_id, index, output=False):
    current_dt = datetime.datetime.now(tz)
    start_of_today = current_dt.replace(hour=0, minute=0, second=0, microsecond=0)
    start_of_week = start_of_today + datetime.timedelta(days=-start_of_today.weekday())
    start_of_time_frame = start_of_week + datetime.timedelta(weeks=-index, days=0, hours=0, minutes=0, seconds=0, microseconds=0)
    end_of_time_frame = start_of_time_frame + datetime.timedelta(days=6, hours=23, minutes=59, seconds=59, microseconds=999999)
    
    start_utc = datetime.datetime.timestamp(start_of_time_frame)
    end_utc = datetime.datetime.timestamp(end_of_time_frame)
    
    date_title = start_of_time_frame.strftime("%B %d, %Y") + ' - ' + end_of_time_frame.strftime("%B %d, %Y")
    
    labels = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su']
    
    if output:
        print('Start', start_of_time_frame)
        print('End', end_of_time_frame)
        print('Title', date_title)

    rtn_data = create_data(station_id, start_utc, end_utc, labels, output=output)
    
    return rtn_data, date_title


def calc_6_week_stats(station_id, index=0, output=False):
    current_dt = datetime.datetime.now(tz)
    start_of_today = current_dt.replace(hour=0, minute=0, second=0, microsecond=0)
    start_of_6_weeks = start_of_today + datetime.timedelta(weeks=-5, days=-start_of_today.weekday())

    start_of_time_frame = start_of_6_weeks + datetime.timedelta(weeks=-index*6, days=0, hours=0, minutes=0, seconds=0, microseconds=0)

    end_of_time_frame = start_of_time_frame + datetime.timedelta(weeks=5, days=6, hours=23, minutes=59, seconds=59, microseconds=999999)

    date_title = start_of_time_frame.strftime("%B %d, %Y") + ' - ' + end_of_time_frame.strftime("%B %d, %Y")

    # Calc week list
    number_of_weeks = 6
    labels = []
    for i in range(number_of_weeks):
        week = start_of_time_frame + datetime.timedelta(weeks=i)
        labels.append(week.strftime("%b %d, %Y"))
    
    start_utc = datetime.datetime.timestamp(start_of_time_frame)
    end_utc = datetime.datetime.timestamp(end_of_time_frame)
    
    if output:
        print('Start', start_of_time_frame)
        print('End', end_of_time_frame)
        print('Title', date_title)

    rtn_data = create_data(station_id, start_utc, end_utc, labels, output=output)
    
    return rtn_data, date_title

def calc_year_stats(station_id, index=0, output=False):
    year = datetime.datetime.now(tz).year - index
    date_title = year

    start_of_time_frame = datetime.datetime(year, 1, 1, tzinfo=tz)

    end_of_time_frame = datetime.datetime(year, 12, 31, hour=23, minute=59, second=59, microsecond=999999, tzinfo=tz)
    
    start_utc = datetime.datetime.timestamp(start_of_time_frame)
    end_utc = datetime.datetime.timestamp(end_of_time_frame)
    
    labels = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.']
    
    if output:
        print('Start', start_of_time_frame)
        print('End', end_of_time_frame)
        print('Title', date_title)

    rtn_data = create_data(station_id, start_utc, end_utc, labels, output=output)
    
    return rtn_data, date_title