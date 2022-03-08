#!/usr/bin/env python
# coding: utf-8

# In[ ]:


try:
    get_ipython().system('jupyter nbconvert --to script realtime_sim.ipynb')
    get_ipython().run_line_magic('load_ext', 'autoreload')
    get_ipython().run_line_magic('autoreload', '2')
except:
    pass


# In[1]:


import time
from numpy import random
from strgen import StringGenerator
import uuid
import sys
from datetime import datetime, timedelta

#client = MongoClient('localhost:27017')
#db = client.ContactDB

sys.path.append(".")
from Optio import Optio


# In[44]:


reset=True
MIN_CYCLE=5
MAX_CYCLE=10*60 #10*60


# # Initialize

# In[45]:


from numpy import random

def draw_from_normal(mean):
#    return mean
    return abs(random.normal(mean,mean))


# In[46]:


# optio = Optio('nikolaus@optio.cloud', 'Vaygts99', instance='demo.optio.cloud', protocol='https') #,instance='demo.optio.cloud')
optio = Optio('nikolaus@optio.cloud', 'Vaygts99', instance='demo.optio.cloud', protocol="https")
#optio = Optio('nikolaus@optio.cloud', 'Vaygts99', instance='sandbox.optio.cloud:5000', protocol="https",access_code='7dokjfdgkbe5fimvuf2jjmrhuf')

# optio.request('GET', 'site_maps')
# print([m['name'] for m in optio.get_maps()])
#optio.curr_map_id = optio.get_map_by_name('Phunkshun')['_id']
#optio.curr_map_id = optio.get_map_by_name('Factory 1')['_id']
#optio.curr_map_id = optio.get_map_by_name('Blank Map')['_id']
optio.curr_map_id = optio.get_map_by_name('Factory 1')['_id']


# # Simulate card deployment
# 
# Cards are created in the queue and the system is simulated until 1/Nth of the card have arrived at the Nth station. 

# In[47]:


if reset:
    optio.clear_map_statistics()


# In[48]:


def create_card(map_id, process_id, template_id, station_id, quantity=1):
     #name = StringGenerator('Order ${SKU}, ${name}, ${color}').render(SKU=list(range(10000,20000)),name=['Rubber ducky','Superhero','Cookie Monster'],color=['yellow','red','green'])
     name = StringGenerator('Order ${SKU}, ${name}, ${color}').render(SKU=list(range(10000,20000)),name=['Warrior','Omega','Tulane'],color=['mauve','pink','yellow'])

     return {'_id':str(uuid.uuid4()),
              'bins': {station_id :{'count':quantity}},
               "fields": [[{'_id': 'DEFAULT_DESCRIPTION_FIELD_ID',
                            
                            'component': 'TEXT_BOX_BIG',
                            'dataType': 'STRING',
                            'fieldName': 'description',
                            'required': False,
                            'showInPreview': True,
                            'key': 0,
                            'value': ''}],
                          [{'_id': 'DEFAULT_DATES_FIELD_ID',
                            'component': 'CALENDAR_START_END',
                            'dataType': 'DATE_RANGE',
                            'fieldName': 'dates',
                            'required': False,
                            'showInPreview': True,
                            'key': 1,
                            'value': [None, None]}]],
               "flags": [],
              'lotNum' : 0,
              'lotTemplateId' : template_id,
              'name':name,
              'description': "",
              'process_id':process_id,
              'map_id':map_id,
              'totalQuantity': quantity,
              'syncWithTemplate' : False,
              #'start_date' : {'year':2021, 'month':2, 'day':random.randrange(5,7)},
              #'end_date' : None,
             }
               
    


# In[49]:


server_settings = optio.request('GET', 'settings')
shift_details = server_settings['shiftDetails']

begin_shift = datetime.strptime(shift_details['startOfShift'],'%H:%M').time()
begin_shift_secs = (begin_shift.hour * 60 + begin_shift.minute) * 60 + begin_shift.second

end_of_shift = datetime.strptime(shift_details['endOfShift'],'%H:%M').time()
end_of_shift_secs = (end_of_shift.hour * 60 + end_of_shift.minute) * 60 + end_of_shift.second

#breaks = [[time.strptime(brk['startOfBreak'],'%H:%M').time(), time.strptime(brk['endOfBreak'],'%H:%M').time()] if brk['enabled'] else [0,0] for brk in shift_details['breaks'].values()]

def round_to_shift_start(dt):
    return datetime.combine(dt, begin_shift)


# In[50]:


## 0. Initialize simulation




map_id=optio.curr_map_id
    
if reset:
    
    start_datetime = round_to_shift_start(datetime.now() - timedelta(days=10))
    print('Starting Simulation at {}'.format(start_datetime))
    start_UTC = datetime.timestamp(start_datetime)

    mcards = 25          # Mean number of cards per station
    vcards = 1           # Plus/minus number of cards at each station

    finished = 0         # Number of items in the finished queue

    optio.delete_lots_on_map()


    ## 1. Create #nqueue cards in each queue    
    processes = optio.get_processes() #db.processes.find()
    product_groups = optio.get_product_groups()
    for process in processes:
        print('Process: {}'.format(process['name']))
        template_ids = [pg['_id'] for pg in product_groups if pg['processId'] == process['_id']]

        lots=[]
        if(mcards-vcards < mcards+vcards):
            ncards=random.randint(mcards-vcards,mcards+vcards)
        else:
            ncards=1;
        print('Creating {} lots'.format(ncards))
        for i in range(ncards):
            template_id = random.choice(template_ids)
            lots.append(create_card(map_id, process['_id'], template_id, 'QUEUE', quantity=random.randint(1,20)))
        optio.create_lots(lots)
else:
    start_datetime = datetime.now()
    print('Starting Simulation at {}'.format(start_datetime))
    start_UTC = datetime.timestamp(start_datetime)


# In[52]:


## 2. Create stations data structure that includes both queues and all lots
speedup_factor = 10000;

reset_cycle_times = True

#def get_seconds(time_str):
#    hh, mm, ss = time_str.split(':')
#    return int(hh) * 3600 + int(mm) * 60 + int(ss)

lots=optio.get_all_lots()
processes=optio.get_processes()
product_groups=optio.get_product_groups()

# Augment station data structure with pointers to lots and simulated time. 
stations=optio.get_stations()

for station in stations:

    print('Working on station {}'.format(station['name']))
    
    # Fill out the cycle time dict for each product group (if not already filled out)
    for pg_id, cycle_time_dict in station['cycle_times'].items():
        rand_ct = random.randint(MIN_CYCLE, MAX_CYCLE)
        if reset_cycle_times or cycle_time_dict['manual'] == 0:
            if cycle_time_dict['actual'] == 0 or reset_cycle_times:
                cycle_time_dict['actual'] = rand_ct
                cycle_time_dict['manual'] = rand_ct
            else:
                cycle_time_dict['manual'] = cycle_time_dict['actual']
                
        if reset_cycle_times or cycle_time_dict['theoretical'] == 0:
            cycle_time_dict['theoretical'] = cycle_time_dict['actual'] / (random.rand()*9 + 1)
        
        station['cycle_times'][pg_id] = cycle_time_dict
    print('  Updating cycle times for station...')
    optio.request('PUT', 'stations/{}'.format(station['_id']), station)
        
    # Populate the station with all the lots at the station
    lots_at_station=[]
    for lot in lots:
        if station['_id'] in lot['bins'].keys():
            lots_at_station.append(lot)
            print('   Adding lot {}'.format(lot['name']))
    
    station['lots']=lots_at_station
    if len(lots_at_station) == 0:
        station['last_action'] = start_UTC
        station['next_action'] = start_UTC
    else:
        next_lot = lots_at_station[0]
        print(next_lot)
        lot_cycle_time = station['cycle_times'][next_lot['lotTemplateId']]['actual']
        station['last_action'] = start_UTC
        station['next_action'] = start_UTC + (draw_from_normal(lot_cycle_time) * next_lot['totalQuantity'] / speedup_factor)
    
# Augment station data structure by queues

for process in processes: # each process has its own queue
    rand_ct = random.randint(1*60, 12*60)
    template={'_id':str(uuid.uuid4()), 
              'name': 'QUEUE_'+process['name'],
              'cycle_time': rand_ct,
              'type':'queue',
             }

    print('Working on station {}'.format(template['name']))
    lots_at_station=[]
    for lot in lots:
        if lot['process_id']==process['_id'] and 'QUEUE' in lot['bins'].keys():
            lots_at_station.append(lot)
            print('   Adding lot {}'.format(lot['name']))
            
    template['next_action'] = start_UTC
    template['lots']=lots_at_station
    stations.append(template)


# In[53]:


def add_lot_to_station(lot, station_id, curr_UTC_time):
    for station in stations:
        if(station['_id']==station_id):
            lot['bins']={station_id:{'count':lot['totalQuantity']}}            
            if(len(station['lots'])==0): # only update time if the target station is empty
                lot_cycle_time = draw_from_normal(station['cycle_times'][lot['lotTemplateId']]['actual'])
                station['next_action'] = curr_UTC_time + (lot_cycle_time * lot['totalQuantity'])
            station['lots'].append(lot)
            return station
    raise Exception('Station not found, lot not added') 

# def seconds_until_shift(dt):
#     if (dt.weekday() >= 5): return timedelta(days=7 - dt.weekday()).total_seconds() - begin_shift_secs
#     t = dt.time();
#     t_seconds = timedelta(hours=t.tm_hour,minutes=t.tm_min,seconds=t.tm_sec).total_seconds()
    
#     if t < begin_shift: return begin_shift_secs - t_seconds
#     for brk in breaks:
#         if t >= brk[0] and t <= brk[1]: return brk[1] - t_seconds
#     if t > end_of_shift: return 
    
#     return False
    

# def add_time_within_shift(curr_UTC_time, add_time):
#     while is_during_break(datetime.fromtimestamp(curr_UTC_time + add_time)):
        
        


# In[ ]:



## 3. Main simulation
#
#     - check all stations for whether they are ready to move
#     - if station is a queue, kick off lot
#     - if station is a human, move lot
#     - pick random next station

start_CPU_time = round(time.time())
sim_UTC_time = start_UTC

maxtime = 300 # seconds

dashboards=optio.get_dashboards()
processes = optio.request('GET', 'processes')
all_routes = optio.request('GET', 'tasks')

process_sources = {}
for p in processes:
    process_sources[p['_id']] = optio.get_sources_from_process(p)

done = False 
#while(time.time() - start_CPU_time < maxtime and done==False):
while(True):
    # print("Time {}".format(sim_UTC_time))
    for station in stations:
        if(station['next_action'] <= sim_UTC_time and len(station['lots'])>0):  # station is ready to release next job AND there is a job            
            lot=station['lots'].pop(0)
            process = ([process for process in processes if process['_id'] == lot['process_id']])[0]

            if(station['type']=='queue'):
                station_id=random.choice(process_sources[process['_id']])
                optio.kickoff_lot(lot, lot['totalQuantity'],station_id, station['next_action'], station['next_action'])
                target_station=add_lot_to_station(lot, station_id, sim_UTC_time) # keep track of action in local memory
                print('{}s - {} - KICKOFF: {:>15} -> {:<15} lot {}'.format(round(time.time() - start_CPU_time), datetime.fromtimestamp(sim_UTC_time).strftime("%Y-%m-%d %H:%M:%S"), station['name'], target_station['name'], lot['name']))
                station['next_action'] = sim_UTC_time + (station['cycle_time'] * lot['totalQuantity'])
            else:
                route_ids=process['routes']
                routes=[route for route in all_routes if route['_id'] in route_ids]
                possible_routes=[route for route in routes if station['_id']==route['load']]
                if(len(possible_routes)):
                    route=random.choice(possible_routes)    
                    optio.move_lot_fast(lot,lot['totalQuantity'], route, station, station['last_action'], station['next_action'])
                    target_station = add_lot_to_station(lot, route['unload'], sim_UTC_time) # keep track of action in local memory
                    print('{}s - {} - MOVE:    {:>15} -> {:<15} lot {}'.format(round(time.time() - start_CPU_time), datetime.fromtimestamp(sim_UTC_time).strftime("%Y-%m-%d %H:%M:%S"), station['name'], target_station['name'], lot['name']))
                else:
                    optio.finish_lot(lot,lot['totalQuantity'],station, station['last_action'], station['next_action'], log_event=station['type'] != 'warehouse')
                    print('{}s - {} - FINISH:  {:>15} -> {:<15} lot {}'.format(round(time.time() - start_CPU_time), datetime.fromtimestamp(sim_UTC_time).strftime("%Y-%m-%d %H:%M:%S"), station['name'], 'FINISH', lot['name']))
                    template_ids = [pg['_id'] for pg in product_groups if pg['processId'] == process['_id']]
                    template_id=random.choice(template_ids)
                    newlot=create_card(map_id, lot["process_id"], template_id, 'QUEUE', quantity=random.randint(1,20))
                    optio.create_lots([newlot])
                    newlot['_id']=optio.get_lot_by_name(newlot['name'])['_id'] # need to do this as mongodb assigns random id
                    next((station for station in stations if station['name']=='QUEUE_'+process['name']), None)['lots'].append(newlot)
                    optio.delete_lot_by_id(lot["_id"])
                    print('{}s - {} - NEW LOT: {:>15} -> {:<15} lot {}'.format(round(time.time() - start_CPU_time), datetime.fromtimestamp(sim_UTC_time).strftime("%Y-%m-%d %H:%M:%S"), 'FINISH',list(newlot['bins'].keys())[0], newlot['name']))
                    
                lot_cycle_time = station['cycle_times'][lot['lotTemplateId']]['actual']
                station['last_action'] = station['next_action']
                station['next_action'] = sim_UTC_time + (draw_from_normal(lot_cycle_time) * lot['totalQuantity'])

            # Create a report at this station
            if random.rand()<=0.05:
                try:
                    dashboard = [dashboard for dashboard in dashboards if dashboard['station']==station['_id']][0]
                    report=random.choice(dashboard['report_buttons'])

                    event = {
                      "_id": str(uuid.uuid4()),
                      "dashboard_id": dashboard['_id'],
                      "datetime": sim_UTC_time,
                      "report_button_id": report['_id'],
                      "station_id": station['_id']
                    }
                    optio.create_reportevent(event)
                except:
                    pass
    
    try:
        sim_UTC_time = min([station['next_action'] for station in stations if len(station['lots'])>0])
        print(datetime.fromtimestamp(sim_UTC_time))
    except:
        print("No next action")
        done=True
        
    if datetime.fromtimestamp(sim_UTC_time) > datetime.now():
        speedup_factor = 1
        
    #while (time.time() - start_CPU_time)*speedup_factor < sim_UTC_time - start_UTC:
    while(datetime.fromtimestamp(sim_UTC_time)>datetime.now()):
        time.sleep(1.0)


# In[57]:


station['_id']


# In[61]:


station


# In[102]:


datetime.now()


# In[103]:


datetime.fromtimestamp(sim_UTC_time)


# # --> End Of Simulation

# 
