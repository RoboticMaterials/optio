#!/usr/bin/env python
# coding: utf-8

# In[1]:


try:
    get_ipython().system('jupyter nbconvert --to script cleanup.ipynb')
except:
    pass


# In[5]:


from pymongo import MongoClient
from bson.objectid import ObjectId
from bson.json_util import dumps
from pprint import pprint
from datetime import datetime
import warnings
import json
import os
import numpy as np
import sys

client = MongoClient('localhost:27017')
db = client.ContactDB


# In[3]:


sys.path.append('../rest_api')
from station_stats import calculate_pg_station_cycle_time


# In[4]:


print('Taking snapshot of database...\n')

if not os.path.exists('./optio_db_snapshots'):
    os.mkdir('./optio_db_snapshots')
    
datetimeStr = datetime.now().strftime('%Y%m%d_%H%M%S')
if not os.path.exists('./optio_db_snapshots/{}'.format(datetimeStr)):
    os.mkdir('./optio_db_snapshots/{}'.format(datetimeStr))
    
collections = ['cards', 'counters', 'dashboards', 'lot_templates', 'processes', 'report_events', 'settings', 'site_maps', 'stations', 'tasks', 'touch_events']
for collection in collections:
    documents = db[collection].find()
    with open('./optio_db_snapshots/{}/{}.json'.format(datetimeStr, collection), 'w+') as f:
        f.write(dumps(documents))


# In[5]:


print('\n\n===== DATASTRUCTURE UPDATES BY RELEASE =====\n')


# In[6]:


## 1.2.0 - Make sure all processes have a basic template
print('1.2.0 - Make sure all processes have a basic template')
processes = db.processes.find()
for process in processes:
    basic_templates = list(db.lot_templates.find({'$and': [{'processId': process['_id']}, {'name': 'Basic'}]}))
    if len(basic_templates) == 0: # Insert basic template
        print('    No Basic product group for process {}'.format(process['name']))
        db.lot_templates.insert_one({
            "processId": process['_id'],
            "map_id": process['map_id'],
            "name":"Basic",
            "fields":[
                [{
                    "_id":"DEFAULT_DESCRIPTION_FIELD_ID",
                    "component":"TEXT_BOX_BIG",
                    "dataType":"STRING",
                    "fieldName":"description",
                    "required":False,
                    "showInPreview":True,
                    "key":0
                }],[{
                    "_id":"DEFAULT_DATES_FIELD_ID",
                    "component":"CALENDAR_START_END"
                    ,"dataType":"DATE_RANGE",
                    "fieldName":"dates",
                    "required":False,
                    "showInPreview":True,
                    "key":1
                }]],
        })
    elif len(basic_templates) > 1: # Too many, delete all but one, and update any card that uses the old one by forcing it to use the one that is kept
        print('    {} Basic product groups found for process {}'.format(len(basic_templates), process['name']))
        for basic_template in basic_templates[1:]:
            cards_w_template_id = db.cards.update_many({'lotTemplateId': basic_template['_id']}, {'$set': {'lotTemplateId': basic_templates[0]['_id']}})
            db.lot_templates.delete_one({'lotTemplateId': basic_template['_id']})

print()


# In[7]:


## 1.2.1 - Change 'BASIC_LOT_TEMPLATE' id to the ID of the actual Basic lot template for all cards
print('1.2.1 - Change "BASIC_LOT_TEMPLATE" id to the ID of the actual Basic lot template for all cards')

lots = db.cards.find()
for lot in lots:
    if lot['lotTemplateId'] == 'BASIC_LOT_TEMPLATE':
        basic_template = db.lot_templates.find_one({'$and': [{'processId': lot['process_id']}, {'name': 'Basic'}]})
        print('    Updating product group ID for lot {}'.format(lot['name']))
        db.cards.update_one({'_id': lot['_id']}, {'$set': {'lotTemplateId': basic_template['_id']}})
        
print()


# In[8]:


## 1.2.1 - If card doesnt have lotNum make one from lotNumber, and delete lotNumber
print('1.2.1 - If card doesnt have lotNum make one from lotNumber, and delete lotNumber')

lots = db.cards.find()
for lot in lots:
    if 'lotNum' not in lot:
        if 'lotNumber' in lot:
            print('    Updating lot {}'.format(lot['name']))
            db.cards.update_one({'_id': lot['_id']}, {'$set': {'lotNum': lot['lotNumber']}, '$unset': {'lotNumber': ''}})
        else:
            warnings.warn('    Lot {} has no lotNum and no lotNumber'.format(lot['name']))
            
print()


# In[9]:


## 1.2.1 - Field Mapping has changed from array (columns) to object (id: column)
print('1.2.1 - Field Mapping has changed from array (columns) to object (id: column)')

deleted = 0
product_groups = db.lot_templates.find()
for pg in product_groups:
    if 'processId' not in pg or db.processes.find_one({'_id': pg['processId']}) is None:
        db.lot_templates.delete_one({'_id': pg['_id']})
        deleted += 1
        continue
    if 'uploadFieldMapping' not in pg or type(pg['uploadFieldMapping']) == list:
        pg_process = db.processes.find_one({'_id': pg['processId']})
        print('    Updating product group {} from process {}'.format(pg['name'], pg_process['name']))
        db.lot_templates.update_one({'_id': pg['_id']}, {'$set': {'uploadFieldMapping': {}}})

print('    Deleted {} products without processId'.format(deleted))


# In[6]:



## 1.2.3 - Add Actual, Desired, and Theoretical Min cycle times for stations (by product group)
print('1.2.3 - Add Actual, Desired, and Theoretical Min cycle times for stations (by product group)')

stations = list(db.stations.find())
processes = list(db.processes.find())

for station in stations:
    
    new_cycle_times = 0
    for process in processes:
        process_stations = [node['stationID'] for node in process['flattened_stations']]
        if station['_id'] in process_stations:
            cycle_times = station['cycle_times'] if 'cycle_times' in station else {}
            product_groups = list(db.lot_templates.find({'processId': process['_id']}))
            for product_group in product_groups:
                if product_group['_id'] in cycle_times:
                    cycle_time_dict = cycle_times[product_group['_id']]
                    if np.array([key in cycle_time_dict for key in ['actual', 'theoretical', 'historical', 'mode', 'manual']]).all():
                        continue
                    else:
                        new_cycle_times += 1
                        if 'actual' not in cycle_time_dict:
                            cycle_time_dict['actual'] = 0
                        if 'manual' not in cycle_time_dict:
                            cycle_time_dict['manual'] = 0
                        if 'theoretical' not in cycle_time_dict: 
                            cycle_time_dict['theoretical'] = 0
                        if 'historical' not in cycle_time_dict:
                            cycle_time_dict['historical'] = 0
                        if 'mode' not in cycle_time_dict:
                            cycle_time_dict['mode'] = 'auto'

                else:                
                    new_cycle_times += 1
                    if 'cycle_time' in station and 'manual_cycle_time' in station:
                        cycle_times[product_group['_id']] = {
                            'theoretical': 0,
                            'actual': station['cycle_time'],
                            'manual': station['manual_cycle_time'],
                            'mode': 'auto',
                            'historical': 0
                        }
                    else:
                        cycle_times[product_group['_id']] = {
                            'theoretical': 0,
                            'historical': 0,
                            'actual': 0,
                            'manual': 0,
                            'mode': 'auto'
                        }
                
    if (new_cycle_times > 0):
        print("    Updated station '{}' with {} product groups".format(station['name'], new_cycle_times))
        db.stations.update_one({'_id': station['_id']}, {'$unset': {'cycle_time': "", 'manual_cycle_time': "", 'cycle_time_mode': ""}, '$set': {'cycle_times': cycle_times}})


# In[15]:


## 1.2.3 - Update all events with the PGS cycle time that was there durring that event and map_id and change user to operator
print('1.2.3 - Update all events with the PGS cycle time that was there durring that event and map_id and change user to operator and set idle time')

touch_events = db.touch_events.find()

stations = db.stations.find()
normalized_stations = {station['_id']: station for station in stations}

product_groups = db.lot_templates.find()
normalized_product_groups = {pg['_id']: pg for pg in product_groups}

invalid_tes = 0
for touch_event in touch_events:
    if 'pgs_cycle_time' not in touch_event:
    
        if touch_event['load_station_id'] == 'QUEUE':
            db.touch_events.update_one({'_id': touch_event['_id']}, {'$set': {'pgs_cycle_time': 0, 'idle_seconds': 0}})
            
        elif touch_event['load_station_id'] in normalized_stations and touch_event['product_group_id'] in normalized_product_groups:
            station = normalized_stations[touch_event['load_station_id']]
            product_group = normalized_product_groups[touch_event['product_group_id']]
            
            try:
                pgs_cycle_time = station['cycle_times'][product_group['_id']]['actual']
                print('    Updating event {}'.format(touch_event['_id']))
                db.touch_events.update_one({'_id': touch_event['_id']}, {'$set': {'pgs_cycle_time': pgs_cycle_time}})
            except KeyError:
                print('Station {} does not have cycle time for product group {}'.format(station['name'], product_group['name']))
                
            if 'map_id' not in touch_event:
                map_id = normalized_stations[touch_event['load_station_id']]['map_id']
                db.touch_events.update_one({'_id': touch_event['_id']}, {'$set': {'map_id': map_id}})
                
            if 'idle_seconds' not in touch_event:
                db.touch_events.update_one({'_id': touch_event['_id']}, {'$set': {'idle_seconds': 0}})
                
        else:
            invalid_tes += 1
            db.touch_events.delete_one({'_id': touch_event['_id']})
    
    if 'operator' not in touch_event:
        if 'user' in touch_event:
            db.touch_events.update_one({'_id': touch_event['_id']}, {'$set': {'operator': touch_event['user']}, '$unset': {'user': ""}})
        else:
            db.touch_event.delete_one({'_id': touch_event['_id']})
        
print('    {} Invalid touch events (no valid staion or no valid product group'.format(invalid_tes))


# In[16]:


## 1.2.3 Update any summaries to use productivity instead of efficiency
print('1.2.3 Update any summaries to use productivity instead of efficiency')

for summary in db.station_summaries.find():
    if 'efficiency' in summary:
        db.station_summaries.update_one({'_id': summary['_id']}, {'$set': {'productivity': summary['efficiency']}, '$unset': {'efficiency': ""}})


# In[17]:


## 1.2.3 - Give every product group a takt time (initialize to 0)
print('1.2.3 - Give every product group a takt time (initialize to 0)')

product_groups = db.lot_templates.find()

for product_group in product_groups:
    if 'taktTime' not in product_group:
        db.lot_templates.update_one({'_id': product_group['_id']}, {'$set': {'taktTime': 0}})


# In[18]:


## 1.3.1 - Add historical cycle time for each product at each station
print('1.3.1 - Add historical cycle time for each product at each station')

stations = list(db.stations.find())
processes = list(db.processes.find())

for station in stations:
    for product_id, ct_dict in station['cycle_times'].items():        
        [pgs_cycle_time, pgs_historical_cycle_time] = calculate_pg_station_cycle_time(station['_id'], product_id, {'move_datetime': datetime.now(), 'quantity': 0})
        db.stations.update_one({'_id': station['_id']}, {'$set': {'cycle_times.{}.actual'.format(product_id): pgs_cycle_time, 'cycle_times.{}.historical'.format(product_id): pgs_historical_cycle_time}})
    


# In[19]:


print('\n\n===== GENERAL CLEANUP =====\n')


# In[20]:


print('Clean Stations')

map_ids = [m['_id'] for m in db.site_maps.find()]

stations = db.stations.find()
stations_wo_map = 0 
for station in stations:
    if station['map_id'] not in map_ids:
        db.stations.delete_one({'_id': station['_id']})
        stations_wo_map += 1
        
    if db.dashboards.count_documents({'_id': ObjectId(station['dashboards'][0])}) == 0:
        warnings.warn('Dashboards for station {} does not exist'.format(station['name']))
        
print('    Deleted {} stations without map'.format(stations_wo_map))
print()


# In[21]:


print('Clean Dashboards')

station_ids = [s['_id'] for s in db.stations.find()]

dashboards = db.dashboards.find()
dashboards_wo_station = 0
for dash in dashboards:
    if dash['station'] not in station_ids:
        db.dashboards.delete_one({'_id': ObjectId(dash['_id'])})
        dashboards_wo_station += 1
        
print('    Deleted {} dashboards without station'.format(dashboards_wo_station))
print()


# In[22]:


print('Clean Processes')

processes = db.processes.find()
processes_wo_map = 0
for process in processes:
    if process['map_id'] not in map_ids:
        db.processes.delete_one({'_id': process['_id']})
        processes_wo_map += 1
        
    for routeId in process['routes']:
        if db.tasks.count_documents({'_id': routeId}) == 0:
            warnings.warn('Route {} in process {} does not exist'.format(routeId, process['name']))
        
print('    Deleted {} processes without map'.format(processes_wo_map))
print()


# In[23]:


print('Clean Routes')

process_ids = [p['_id'] for p in db.processes.find()]

routes = db.tasks.find()
routes_wo_map = 0
routes_wo_process = 0
for route in routes:
    if route is None: 
        db.tasks.delete_one({'_id': route['_id']})
        continue
    if route['map_id'] not in map_ids:
        db.tasks.delete_one({'_id': route['_id']})
        routes_wo_map += 1
        continue
    elif route['processId'] not in process_ids or db.processes.find_one({'_id': route['processId']}) is None:
        db.tasks.delete_one({'_id': route['_id']})
        routes_wo_process += 1
        continue
        
    if db.stations.count_documents({'_id': route['load']}) == 0:
        process = db.processes.find_one({'_id': route['processId']})
        warnings.warn('    Route {} in process {} does not have an existing load station'.format(route['name'], process['name']))
        continue
        
    if db.stations.count_documents({'_id': route['unload']}) == 0:
        process = db.processes.find_one({'_id': route['processId']})
        warnings.warn('    Route {} in process {} does not have an existing unload station'.format(route['name'], process['name']))
        continue
print()


# In[24]:


print('Clean Product Groups')

pgs = db.lot_templates.find()
pgs_wo_process = 0
for pg in pgs:
    if 'processId' not in pg or pg['processId'] not in process_ids:
        db.lot_templates.delete_one({'_id': pg['_id']})
        pgs_wo_process += 1
        
print('    Deleted {} product groups without process'.format(pgs_wo_process))
print()


# In[25]:


print('Clean Cards')

pg_ids = [pg['_id'] for pg in db.lot_templates.find()]

cards = db.cards.find()
cards_wo_map = 0
cards_wo_process = 0
cards_wo_pg = 0
cards_wo_bins = 0
for card in cards:
    if 'bins' not in card or len(card['bins'].keys()) == 0:
        db.cards.delete_one({'_id': card['_id']})
        cards_wo_bins += 1
    if 'lotTemplateId' not in card or card['lotTemplateId'] not in pg_ids:
        db.cards.delete_one({'_id': card['_id']})
        cards_wo_pg += 1
    elif card['map_id'] not in map_ids:
        cards_wo_map += 1
        # Dont delete, this is a major bug because the pg exists, meaning the process exists, meaning the map exists
    elif card['process_id'] not in process_ids:
        cards_wo_process += 1
        # Dont delete, this is a major bug because the pg exists, meaning the process exists

print('    Deleted {} cards without product group'.format(cards_wo_pg))
print('    Deleted {} cards with no bins'.format(cards_wo_bins))
if cards_wo_map: warnings.warn('    {} cards have no map'.format(cards_wo_map))
if cards_wo_process: warnings.warn('    {} cards have no process'.format(cards_wo_process))
print()


# In[26]:


print('Clean Report Events')

reports = db.report_events.find()
reports_wo_station = 0
for report in reports:
    if report['station_id'] not in station_ids:
        db.report_events.delete_one({'_id': report['_id']})
        reports_wo_station += 1
        
print('    Deleted {} reports with no station'.format(reports_wo_station))
print()


# In[29]:


print('Clean Touch Events')

lot_ids = [l['_id'] for l in db.cards.find()]

touch_events = db.touch_events.find()
events_wo_process = 0
events_wo_load_and_lot = 0
events_wo_map = 0
for e in touch_events:
    if 'process_id' not in e or e['process_id'] not in process_ids:
        db.touch_events.delete_one({'_id': e['_id']})
        events_wo_process += 1
    elif ('load_station_id' not in e or e['load_station_id'] not in station_ids) or ('lot_id' not in e or e['lot_id'] not in lot_ids):
        db.touch_events.delete_one({'_id': e['_id']})
        events_wo_load_and_lot += 1
    elif 'map_id' not in e or e['map_id'] not in map_ids:
        load_station = db.stations.find_one({'_id': e['load_station_id']})
        db.touch_events.update_one({'_id': e['_id']}, {'$set': {'map_id': load_station['map_id']}})
        events_wo_map += 1
        # Dont delete, this is a major bug
        
print('    Deleted {} events without process'.format(events_wo_process))
print('    Deleted {} events with no load station or no lot'.format(events_wo_load_and_lot))
if events_wo_map: warnings.warn('    {} events did not have a map'.format(events_wo_map))
print()
        


# In[ ]:




