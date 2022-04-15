import pandas as pd
import json
import datetime
import time
import numpy as np
import pytz
from pprint import pprint
from app import app
from ddb import client
import matplotlib.pyplot as plt  # For output


db = client.ContactDB


def get_timezone():
    settings = db.settings.find_one({})
    if 'timezone' in settings:
        tz = pytz.timezone(settings['timezone']['label'])
    else:
        tz = pytz.timezone('America/Denver')
    print(tz)
    return tz


def get_stats(station_id, info, output=False):
    if output:
        # Get station info
        station = db.stations.find_one({'_id': station_id})
        if station is None:
            print('Station Name: Deleted Station')
        else:
            print('Station Name:', station['name'])

    data = {}
    if info['timespan'] == 'day':
        data['reports'], data['date_title'] = calc_day_stats(
            station_id, index=info['index'], output=output)
    elif info['timespan'] == 'week':
        data['reports'], data['date_title'] = calc_week_stats(
            station_id, index=info['index'], output=output)
    elif info['timespan'] == 'month':
        data['reports'], data['date_title'] = calc_6_week_stats(
            station_id, index=info['index'], output=output)
    else:
        data['reports'], data['date_title'] = calc_year_stats(
            station_id, index=info['index'], output=output)

    return json.dumps(data)


def create_data(station_id, start_utc, end_utc, lables, output=False):
    # Create bins for data
    bins = np.linspace(start_utc, end_utc, len(lables)+1)

    start = datetime.datetime.fromtimestamp(start_utc)
    end = datetime.datetime.fromtimestamp(end_utc)

    # Fetch data
    # TODO only fetch data from time frame to make scalable
    df = pd.DataFrame(list(db.report_events.find({'station_id': station_id})))

    if len(df) > 0:

        df = df.set_index('datetime')
        # Crop data
        df = df[start:end]
        # Find unique ids
        unique_ids = df['report_button_id'].unique()

        # Bin data for each unique id
        data_dict = {}
        for report_id in unique_ids:
            df_1 = df[df['report_button_id'] == report_id]
            times = [datetime.datetime.timestamp(t) for t in df_1.index]
            data, edges = np.histogram(times, bins)
            data_dict[report_id] = data

            # Output graph
            if len(times) > -1 and output:
                print('Data', data)
                plt.figure(figsize=(30, 10))
                plt.bar(lables, data, color='green')
                plt.show()

        # Format data for frontend
        rtn_data = []
        for i, lable in enumerate(lables):
            temp_dict = {'lable': lable}
            for report_id in unique_ids:
                temp_dict[report_id] = int(data_dict[report_id][i])

            rtn_data.append(temp_dict)
    else:
        rtn_data = []

    return rtn_data


def calc_day_stats(station_id, index, output=False):
    tz = get_timezone()
    current_dt = datetime.datetime.now(tz)
    start_of_today = current_dt.replace(
        hour=0, minute=0, second=0, microsecond=0)
    start_of_time_frame = start_of_today + \
        datetime.timedelta(days=-index, hours=0, minutes=0,
                           seconds=0, microseconds=0)
    end_of_time_frame = start_of_time_frame + \
        datetime.timedelta(days=1, hours=0, minutes=0,
                           seconds=0, microseconds=0)
    date_title = start_of_time_frame.strftime("%B %d, %Y")

#     fmt = "%Y-%m-%d %H:%M:%S %Z%z"
#     print('Start Time Day', start_of_time_frame.strftime(fmt))
#     print('End Time Day', end_of_time_frame.strftime(fmt))

#     start_utc = time.mktime(start_of_time_frame.timetuple())
#     end_utc = time.mktime(end_of_time_frame.timetuple())
    start_utc = datetime.datetime.timestamp(start_of_time_frame)
    end_utc = datetime.datetime.timestamp(end_of_time_frame)

    date_title = start_of_time_frame.strftime("%B %d, %Y")

    lables = ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am',
              '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm']

    if output:
        print('Start', start_of_time_frame)
        print('End', end_of_time_frame)
        print('Title', date_title)

    rtn_data = create_data(station_id, start_utc,
                           end_utc, lables, output=output)

    return rtn_data, date_title


def calc_week_stats(station_id, index, output=False):
    tz = get_timezone()
    current_dt = datetime.datetime.now(tz)
    start_of_today = current_dt.replace(
        hour=0, minute=0, second=0, microsecond=0)
    start_of_week = start_of_today + \
        datetime.timedelta(days=-start_of_today.weekday())
    start_of_time_frame = start_of_week + \
        datetime.timedelta(weeks=-index, days=0, hours=0,
                           minutes=0, seconds=0, microseconds=0)
    end_of_time_frame = start_of_time_frame + \
        datetime.timedelta(days=6, hours=23, minutes=59,
                           seconds=59, microseconds=999999)

#     fmt = "%Y-%m-%d %H:%M:%S %Z%z"
#     print('Start Time Week', start_of_time_frame.strftime(fmt))
#     print('End Time Week', end_of_time_frame.strftime(fmt))
    start_utc = datetime.datetime.timestamp(start_of_time_frame)
    end_utc = datetime.datetime.timestamp(end_of_time_frame)

    date_title = start_of_time_frame.strftime(
        "%B %d, %Y") + ' - ' + end_of_time_frame.strftime("%B %d, %Y")

    lables = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su']

    if output:
        print('Start', start_of_time_frame)
        print('End', end_of_time_frame)
        print('Title', date_title)

    rtn_data = create_data(station_id, start_utc,
                           end_utc, lables, output=output)

    return rtn_data, date_title


def calc_6_week_stats(station_id, index=0, output=False):
    tz = get_timezone()
    current_dt = datetime.datetime.now(tz)
    start_of_today = current_dt.replace(
        hour=0, minute=0, second=0, microsecond=0)
    start_of_6_weeks = start_of_today + \
        datetime.timedelta(weeks=-5, days=-start_of_today.weekday())

    start_of_time_frame = start_of_6_weeks + \
        datetime.timedelta(weeks=-index*6, days=0, hours=0,
                           minutes=0, seconds=0, microseconds=0)

    end_of_time_frame = start_of_time_frame + \
        datetime.timedelta(weeks=5, days=6, hours=23,
                           minutes=59, seconds=59, microseconds=999999)

    date_title = start_of_time_frame.strftime(
        "%B %d, %Y") + ' - ' + end_of_time_frame.strftime("%B %d, %Y")

    # Calc week list
    number_of_weeks = 6
    lables = []
    for i in range(number_of_weeks):
        week = start_of_time_frame + datetime.timedelta(weeks=i)
        lables.append(week.strftime("%b %d, %Y"))

#     fmt = "%Y-%m-%d %H:%M:%S %Z%z"
#     print('Start Time Month', start_of_time_frame.strftime(fmt))
#     print('End Time Month', end_of_time_frame.strftime(fmt))
    start_utc = datetime.datetime.timestamp(start_of_time_frame)
    end_utc = datetime.datetime.timestamp(end_of_time_frame)

    if output:
        print('Start', start_of_time_frame)
        print('End', end_of_time_frame)
        print('Title', date_title)

    rtn_data = create_data(station_id, start_utc,
                           end_utc, lables, output=output)

    return rtn_data, date_title


def calc_year_stats(station_id, index=0, output=False):
    tz = get_timezone()
    year = datetime.datetime.now(tz).year - index
    date_title = year

    start_of_time_frame = datetime.datetime(year, 1, 1, tzinfo=tz)

    end_of_time_frame = datetime.datetime(
        year, 12, 31, hour=23, minute=59, second=59, microsecond=999999, tzinfo=tz)

#     fmt = "%Y-%m-%d %H:%M:%S %Z%z"
#     print('Start Time Year', start_of_time_frame.strftime(fmt))
#     print('End Time Year', end_of_time_frame.strftime(fmt))
    start_utc = datetime.datetime.timestamp(start_of_time_frame)
    end_utc = datetime.datetime.timestamp(end_of_time_frame)

    lables = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.',
              'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.']

    if output:
        print('Start', start_of_time_frame)
        print('End', end_of_time_frame)
        print('Title', date_title)

    rtn_data = create_data(station_id, start_utc,
                           end_utc, lables, output=output)

    return rtn_data, date_title
