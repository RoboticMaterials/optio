# You can access the following resource attributes as environment variables from your Lambda function
#         API_RMSTUDIOCLOUD_REPORTEVENTTABLE_NAME
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

# set time zone
tz = timezone('America/Denver')

# create dynamo class
# i turned off certificate verification but we should turn it back on when we find a solution
dynamodb = resource('dynamodb', region_name=os.environ['REGION'], verify=False)

# table def parameters of events for stations
table = dynamodb.Table(os.environ['API_RMSTUDIOCLOUD_REPORTEVENTTABLE_NAME'])

def handler(event, context):

    # define varibles coming from putside this function
    env = os.environ
    arguments = event['arguments']

    info = {}

    info['index'] = arguments['index']

    info['timespan'] = arguments['timeSpan']

    stationId = arguments['stationId']

    output = False

    calculated_data = get_stats(stationId, info,  output)

    print(calculated_data)

    return {
        'date': calculated_data['date_title'],
        'throughPut': calculated_data['reports']
    }

# Analytics functions
def get_stats(stationId, info, output=False):
    
    data = {}
    if info['timespan'] == 'day':
        data['reports'], data['date_title'] = calc_day_stats(stationId, index=info['index'], output=output)
    elif info['timespan'] == 'week':
        data['reports'], data['date_title'] = calc_week_stats(stationId, index=info['index'], output=output)
    elif info['timespan'] == 'month':
        data['reports'], data['date_title'] = calc_6_week_stats(stationId, index=info['index'], output=output)
    else:
        data['reports'], data['date_title'] = calc_year_stats(stationId, index=info['index'], output=output)
    
    return data

def create_data(stationId, start_utc, end_utc, lables, output=False):

    station_events_response = table.scan(
        FilterExpression=Key('stationId').eq(stationId) & Key('time').gt(Decimal(start_utc)) & Key('time').lt(Decimal(end_utc))
    )
    
    events_data = station_events_response['Items']

    # Create bins for data
    bins = linspace(start_utc, end_utc, len(lables)+1)

    df = DataFrame(list(events_data))

    if len(df) > 0:

        df.time = df.time.astype(float)

        # Create bins for data
        bins = linspace(0, len(df)-1, len(labels)+1)
        
        df = df.set_index('date')

        # Find unique ids
        unique_ids = df[start_utc : end_utc]['report_button_id'].unique()
        
        # Bin data for each unique id
        data_dict = {}

        for report_id in unique_ids:
            df_1 = df[df['report_button_id'] == report_id]
            times = df_1.index
            data, edges = np.histogram(times, bins)
            data_dict[report_id] = data
            
            # Output graph
            if len(times) > -1 and output:
                print('Data', data)
                plt.figure(figsize=(30,10))
                plt.bar(lables, data, color='green')
                plt.show()

        # Format data for frontend
        rtn_data = []
        for i, lable in enumerate(lables):
            temp_dict = {'lable':lable}
            for report_id in unique_ids:
                temp_dict[report_id] = int(data_dict[report_id][i])

            rtn_data.append(temp_dict) 
    else:
        rtn_data = []
        
    return rtn_data

def calc_day_stats(stationId, index, output=False):
    current_dt = datetime.datetime.now(tz)
    start_of_today = current_dt.replace(hour=0, minute=0, second=0, microsecond=0)
    start_of_time_frame = start_of_today + datetime.timedelta(days=-index, hours=0, minutes=0, seconds=0, microseconds=0)
    end_of_time_frame = start_of_time_frame + datetime.timedelta(days=1, hours=0, minutes=0, seconds=0, microseconds=0)
    date_title = start_of_time_frame.strftime("%B %d, %Y")
    
    start_utc = datetime.datetime.timestamp(start_of_time_frame)
    end_utc = datetime.datetime.timestamp(end_of_time_frame)
    
    date_title = start_of_time_frame.strftime("%B %d, %Y")
    
    lables = ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm']

    rtn_data = create_data(stationId, start_utc, end_utc, lables, output=output)
    
    return rtn_data, date_title


def calc_week_stats(stationId, index, output=False):
    current_dt = datetime.datetime.now(tz)
    start_of_today = current_dt.replace(hour=0, minute=0, second=0, microsecond=0)
    start_of_week = start_of_today + datetime.timedelta(days=-start_of_today.weekday())
    start_of_time_frame = start_of_week + datetime.timedelta(weeks=-index, days=0, hours=0, minutes=0, seconds=0, microseconds=0)
    end_of_time_frame = start_of_time_frame + datetime.timedelta(days=6, hours=23, minutes=59, seconds=59, microseconds=999999)

    start_utc = datetime.datetime.timestamp(start_of_time_frame)
    end_utc = datetime.datetime.timestamp(end_of_time_frame)
    
    date_title = start_of_time_frame.strftime("%B %d, %Y") + ' - ' + end_of_time_frame.strftime("%B %d, %Y")
    
    lables = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su']

    rtn_data = create_data(stationId, start_utc, end_utc, lables, output=output)
    
    return rtn_data, date_title


def calc_6_week_stats(stationId, index=0, output=False):
    current_dt = datetime.datetime.now(tz)
    start_of_today = current_dt.replace(hour=0, minute=0, second=0, microsecond=0)
    start_of_6_weeks = start_of_today + datetime.timedelta(weeks=-5, days=-start_of_today.weekday())

    start_of_time_frame = start_of_6_weeks + datetime.timedelta(weeks=-index*6, days=0, hours=0, minutes=0, seconds=0, microseconds=0)

    end_of_time_frame = start_of_time_frame + datetime.timedelta(weeks=5, days=6, hours=23, minutes=59, seconds=59, microseconds=999999)

    date_title = start_of_time_frame.strftime("%B %d, %Y") + ' - ' + end_of_time_frame.strftime("%B %d, %Y")

    # Calc week list
    number_of_weeks = 6
    lables = []
    for i in range(number_of_weeks):
        week = start_of_time_frame + datetime.timedelta(weeks=i)
        lables.append(week.strftime("%b %d, %Y"))
    
    start_utc = datetime.datetime.timestamp(start_of_time_frame)
    end_utc = datetime.datetime.timestamp(end_of_time_frame)

    rtn_data = create_data(stationId, start_utc, end_utc, lables, output=output)
    
    return rtn_data, date_title

def calc_year_stats(stationId, index=0, output=False):
    year = datetime.datetime.now(tz).year - index
    date_title = year

    start_of_time_frame = datetime.datetime(year, 1, 1, tzinfo=tz)

    end_of_time_frame = datetime.datetime(year, 12, 31, hour=23, minute=59, second=59, microsecond=999999, tzinfo=tz)
    
    start_utc = datetime.datetime.timestamp(start_of_time_frame)
    end_utc = datetime.datetime.timestamp(end_of_time_frame)
    
    lables = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.']

    rtn_data = create_data(stationId, start_utc, end_utc, lables, output=output)
    
    return rtn_data, date_title