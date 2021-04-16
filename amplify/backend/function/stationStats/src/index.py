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

import os

from boto3 import resource
from boto3.dynamodb.conditions import Key

# Analysis Imports
from pandas import DataFrame

from numpy import linspace

from numpy import histogram

from decimal import Decimal

import time
import datetime 

from pytz import timezone

# create dynamo class
# i turned off certificate verification but we should turn it back on when we find a solution
dynamodb = resource('dynamodb', region_name=os.environ['REGION'], verify=False)

# table def parameters of events for stations
table = dynamodb.Table(os.environ['API_RMSTUDIOCLOUD_STATIONEVENTTABLE_NAME'])

def handler(event, context):

    # define varibles coming from putside this function
    env = os.environ
    arguments = event['arguments']

    info = {}

    if 'sort_index' not in arguments:
        info['sort_index'] = 'object'

    info['index'] = arguments['index']

    info['timespan'] = arguments['timeSpan']

    if 'timeZone' in info:
        tz = timezone(arguments['timeZone'])
    else:
        tz = timezone('America/Denver')

    stationId = arguments['stationId']

    output = False

    calculated_data = get_stats(stationId, info, tz, output)

    return {
        'date': calculated_data['date_title'],
        'organizationId': 'orgId',
        'stationId': arguments['stationId'],
        'throughPut': calculated_data['throughPut']
    }

# Analytics functions
def get_stats(stationId, info, tz, output=False):

    data = {}

    if info['timespan'] == 'day':
        data['throughPut'], data['date_title'] = calc_day_stats(stationId, tz, index=info['index'], sort_key=info['sort_index'], output=output)
    elif info['timespan'] == 'line':
        data['throughPut'], data['date_title'] = calc_day_line_stats(stationId, tz, index=info['index'])
    elif info['timespan'] == 'week':
        data['throughPut'], data['date_title'] = calc_week_stats(stationId, tz, index=info['index'], sort_key=info['sort_index'],output=output)
    elif info['timespan'] == 'month':
        data['throughPut'], data['date_title'] = calc_6_week_stats(stationId, tz, index=info['index'], sort_key=info['sort_index'],output=output)
    else:
        data['throughPut'], data['date_title'] = calc_year_stats(stationId, tz, index=info['index'], sort_key=info['sort_index'],output=output)
    return data

def create_data(stationId, start_utc, end_utc, labels, tz, sort_key='object', output=False):

    bins = linspace(start_utc, end_utc, len(labels)+1)

    # This is not now because it breaks things but the it works
    station_events_response = table.scan(
        FilterExpression=Key('station').eq(stationId) # & Key('time').gt(Decimal(start_utc)) & Key('time').lt(Decimal(end_utc))
    )

    events_data = station_events_response['Items']

    df = DataFrame(list(events_data))

    if len(df) > 0:

        # Find unique ids
        unique_ids = df[sort_key].unique()   

        df = df.set_index('time')

        # Crop data
        # This is not now because it breaks things but the it works
        # df = df[int(start_utc) : int(end_utc)]

        # Bin data for each unique id
        data_dict = {}

        for unique_id in unique_ids:
            if unique_id is None:
                df_1 = df[df[sort_key].isnull().values]
            else:
                df_1 = df[df[sort_key] == unique_id]

            times = df_1.index.repeat(df_1['quantity'])
            data, edges = histogram(times, bins)
            data_dict[unique_id] = data

        # Format data for frontend
        rtn_data = []
        for i, lable in enumerate(labels):
            temp_dict = {'lable':lable}
            for unique_id in unique_ids:
                temp_dict[unique_id] = int(data_dict[unique_id][i])

            rtn_data.append(temp_dict) 
    else:
        rtn_data = []
        
    return rtn_data

def calc_day_stats(stationId, tz, index, sort_key='object', output=False):
    
    current_dt = datetime.datetime.now(tz)
    start_of_today = current_dt.replace(hour=0, minute=0, second=0, microsecond=0)
    start_of_time_frame = start_of_today + datetime.timedelta(days=-index, hours=0, minutes=0, seconds=0, microseconds=0)
    end_of_time_frame = start_of_time_frame + datetime.timedelta(days=1, hours=0, minutes=0, seconds=0, microseconds=0)
    date_title = start_of_time_frame.strftime("%B %d, %Y")

    start_utc = datetime.datetime.timestamp(start_of_time_frame)
    end_utc = datetime.datetime.timestamp(end_of_time_frame)
    
    fmt = "%Y-%m-%d %H:%M:%S %Z%z"
    
    date_title = start_of_time_frame.strftime("%B %d, %Y")
    
    labels = ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm']

    rtn_data = create_data(stationId, start_utc, end_utc, labels, tz, sort_key=sort_key, output=output)

    return rtn_data, date_title

def calc_day_line_stats(stationId, tz, index=0):
    # scan and filter data
    station_events_response = table.scan(
        FilterExpression=Key('station').eq(stationId)
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

def calc_week_stats(stationId, tz, index, sort_key='object', output=False):
    current_dt = datetime.datetime.now(tz)
    start_of_today = current_dt.replace(hour=0, minute=0, second=0, microsecond=0)
    start_of_week = start_of_today + datetime.timedelta(days=-start_of_today.weekday())
    start_of_time_frame = start_of_week + datetime.timedelta(weeks=-index, days=0, hours=0, minutes=0, seconds=0, microseconds=0)
    end_of_time_frame = start_of_time_frame + datetime.timedelta(days=6, hours=23, minutes=59, seconds=59, microseconds=999999)
    
    start_utc = datetime.datetime.timestamp(start_of_time_frame)
    end_utc = datetime.datetime.timestamp(end_of_time_frame)
    
    date_title = start_of_time_frame.strftime("%B %d, %Y") + ' - ' + end_of_time_frame.strftime("%B %d, %Y")
    
    labels = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su']

    rtn_data = create_data(stationId, start_utc, end_utc, labels, tz, sort_key=sort_key, output=output)
    
    return rtn_data, date_title


def calc_6_week_stats(stationId, tz, sort_key='object', index=0, output=False):
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

    rtn_data = create_data(stationId, start_utc, end_utc, labels, tz, sort_key=sort_key, output=output)
    
    return rtn_data, date_title

def calc_year_stats(stationId, tz, index=0, sort_key='object', output=False):
    year = datetime.datetime.now(tz).year - index
    date_title = year

    start_of_time_frame = datetime.datetime(year, 1, 1, tzinfo=tz)

    end_of_time_frame = datetime.datetime(year, 12, 31, hour=23, minute=59, second=59, microsecond=999999, tzinfo=tz)
    
    start_utc = datetime.datetime.timestamp(start_of_time_frame)
    end_utc = datetime.datetime.timestamp(end_of_time_frame)
    
    labels = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.']

    rtn_data = create_data(stationId, start_utc, end_utc, labels, tz, sort_key=sort_key, output=output)
    
    return rtn_data, date_title