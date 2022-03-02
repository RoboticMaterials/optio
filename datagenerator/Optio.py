
import requests
import boto3
import json

from datetime import timezone
import datetime



def get_utc_seconds():
    dt = datetime.datetime.now(timezone.utc)
  
    utc_time = dt.replace(tzinfo=timezone.utc)
    return round(utc_time.timestamp()*1000)

def get_utc_seconds():
    dt = datetime.datetime.now(timezone.utc)
  
    utc_time = dt.replace(tzinfo=timezone.utc)
    return round(utc_time.timestamp()*1000)

class Optio:
    # https://dev.optio.cloud:5000/api/ui
    # Sandbox: '7dokjfdgkbe5fimvuf2jjmrhuf'
    # Internal: '110868d55nq4qtqm2kp62curm9'
    
    def __init__(self, username, password, instance='dev.optio.cloud', protocol='https', access_code='110868d55nq4qtqm2kp62curm9'):        
        self.__url = '{}://{}/api/'.format(protocol, instance)
        self.__access_token = self.authenticate(username, password, app_client_id=access_code)
        
        maps = self.request('GET', 'site_maps')
        self.curr_map_id = maps[0]['_id']
        
    @property
    def access_token(self):
        return self.__access_token
        
    def authenticate(self, username, password, app_client_id):
        client = boto3.client('cognito-idp', region_name='us-east-2')
    
        resp = client.initiate_auth(
            # UserPoolId=user_pool_id,
            ClientId=app_client_id,
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                "USERNAME": username,
                "PASSWORD": password
            }
        )
        
        print('Login success')
        return resp['AuthenticationResult']['IdToken']
        
    def request(self, method='GET', operator='', payload=None):

        if operator in ['stations', 'processes', 'dashboards', 'tasks', 'cards/templates', 'cards'] and method == 'GET':
            operator = 'site_maps/{}/{}'.format(self.curr_map_id, operator)
        
        response = requests.request(
            method,
            url=self.__url + operator,
            headers={
                'Authorization': '{}'.format(self.__access_token),
                'Access-Control-Allow-Origin': '*', 
                'Content-Type': 'application/json'     
            },
            data=json.dumps(payload))
        
        if method != 'DELETE':
            try:
                return json.loads(response.json())
            except Exception:
                raise Exception(response.text)
        
        
    ## ========== Basic GET functions ========= ##
    
    def get_maps(self):
        return self.request('GET', 'site_maps')
    
    # ----- GET by ID ----- #
    def get_station_by_id(self, ID):
        return self.request('GET', 'stations/{}'.format(ID))
    
    def get_route_by_id(self, ID):
        return self.request('GET', 'tasks/{}'.format(ID))
    
    def get_process_by_id(self, ID):
        return self.request('GET', 'processes/{}'.format(ID))
    
    def get_lot_by_id(self, ID):
        return self.request('GET', 'cards/{}'.format(ID))
    
    def get_lot_template_by_id(self, ID):
        return self.request('GET', 'cards/templates/{}'.format(ID))
    
    def get_dashboard_by_id(self, ID):
        return self.request('GET', 'dashboards/{}'.format(ID))
    
    def get_map_by_id(self, ID):
        return self.request('GET', 'site_maps/{}'.format(ID))
    
    # ----- GET by Name ----- #
    def get_station_by_name(self, name):
        stations = self.request('GET', 'stations')
        return next(station for station in stations if station['name'] == name)
    
    def get_route_by_name(self, name):
        routes = self.request('GET', 'tasks')
        return next(route for route in routes if route['name'] == name)
    
    def get_process_by_name(self, name):
        processes = self.request('GET', 'processes')
        return next(process for process in processes if process['name'] == name)
    
    def get_lot_by_name(self, name):
        lots = self.request('GET', 'cards')
        return next(lot for lot in lots if lot['name'] == name)
    
    def get_lot_template_by_name(self, process_id, name):
        #lot_templates = self.request('GET', 'lot_templates')
        lot_templates=self.request('GET','site_maps/{}/cards/templates'.format(self.curr_map_id))

        return [lot_template for lot_template in lot_templates if lot_template['name'] == name and lot_template['processId']==process_id]
    
    def get_map_by_name(self, name):
        site_maps = self.request('GET', 'site_maps')
        return next(site_map for site_map in site_maps if site_map['name'] == name)
    
    # ---- GET Collections ----- #
    
    def get_processes(self):
        return self.request('GET','processes')
    
    def get_stations(self):
        return self.request('GET','stations')
    
    def get_dashboards(self):
        return self.request('GET','site_maps/{}/dashboards'.format(self.curr_map_id))
    
    def get_all_lots(self):
        lots = self.request('GET','site_maps/{}/cards'.format(self.curr_map_id))
        return lots
        
    def get_all_lot_ids(self):
            lots = self.request('GET','site_maps/{}/cards'.format(self.curr_map_id))
            return [lot['_id'] for lot in lots]
        
    def get_all_routes(self):
        return self.request('GET', 'tasks')

    def get_product_groups(self):
        return self.request('GET', 'cards/templates')
    
    
    ## ========== Basic Set function =========== ##
    
    def clear_map_statistics(self):
        self.request('DELETE', 'touch_events/site_map/{}'.format(self.curr_map_id))
        self.request('DELETE', 'station_summaries')
        self.request('DELETE', 'process_summaries')
        
        
    def delete_lot_by_id(self, ID):
        return self.request('DELETE', 'cards/{}'.format(ID))
    
#   return self.request('GET', 'cards/{}'.format(ID))

    def delete_lots_on_map(self):
        self.request('DELETE', 'site_maps/{}/cards'.format(self.curr_map_id))
    
    def delete_all_lots(self):
        for _id in self.get_all_lot_ids():
            self.delete_lot_by_id(_id)
            
    ## ========== Sim Helper Functions ========= ##
    def get_sources_from_process(self,process):
        sources=[]
        all_routes = self.get_all_routes()
        process_routes = [route for route in all_routes if route['processId'] == process['_id']]
        
        load_stations = [route['load'] for route in process_routes]
        unload_stations = [route['unload'] for route in process_routes]

        for ls_id in load_stations:
            #name=optio.get_station_by_id(ls)['name']   
            if(ls_id not in unload_stations):
                #print('{} is a source'.format(name))
                load_station = self.get_station_by_id(ls_id)
                if load_station['type'] != 'warehouse':
                    sources.append(ls_id)
        return sources


    
    def find_route_between_stations(self, process_name, load_station_name, unload_station_name):
        routes = self.request('GET', 'tasks')
        process = self.get_process_by_name(process_name)
        if not process: raise Exception('Process {} does not exist'.format(process_name))
        for route in routes:
            load_station = self.get_station_by_id(route['load'])
            unload_station = self.get_station_by_id(route['unload'])
            
            if route['processId'] == process['_id'] and load_station['name'] == load_station_name and unload_station['name'] == unload_station_name:
                return route
            
        raise Exception('Route between {} and {} does not exist'.format(load_station_name, unload_station_name))
        
    def find_lots_at_station(self, station_name):
        station_id = self.get_station_by_name(station_name)['_id']
        cards = self.request('GET', 'cards')
        cards_at_station = [card for card in cards if station_id in card['bins'].keys()]
        return cards_at_station
            
    def move_lot_fast(self, lot, quantity, route, load_station, start_time, move_time, log_event=True, operator='Operator'):
        
         
        load_dashboard = self.get_dashboard_by_id(load_station['dashboards'][0])
        lot_id=lot['_id']
        route_id=route['_id']
        
        # Extract load and unload stations from route
        load_station_id = route['load']
        unload_station_id = route['unload']
        
        # Bins contain the information about how many parts are at what station
        # Make sure this move event is valid
        bins = lot['bins']
        if load_station_id not in bins.keys():
            raise Exception('There are no parts of lot at route load station')
        elif bins[load_station_id]['count'] < quantity:
            raise Exception('Cannot move {} parts from lot when only {} parts exist at load station'.format(quantity, bins[load_station_id]['count']))
        
        # Set the new quantity at the unload station
        if unload_station_id in bins.keys():
            bins[unload_station_id]['count'] += quantity
        else:
            bins[unload_station_id] = {
                'count': quantity
            }
        
        # Subtract the move quantity from the load station, and delete that bin if it is now empty
        bins[load_station_id]['count'] -= quantity
        if bins[load_station_id]['count'] <= 0 and len(bins[load_station_id].keys()) == 1:
            del bins[load_station_id]
        
        # Update the lot in the DB
        lot['bins'] = bins  
        self.request('PUT', 'cards/{}'.format(lot['_id']), lot)
        
        # Log touch event
        if log_event:
            
            # Cumulative WIP at that station (by product group)
            wip = {}
            for station_lot in load_station['lots']:
                if station_lot['lotTemplateId'] in wip:
                    wip[station_lot['lotTemplateId']] += station_lot['bins'][load_station['_id']]['count']
                else:
                    wip[station_lot['lotTemplateId']] = station_lot['bins'][load_station['_id']]['count']
                        
            touch_event = {
                "dashboard_id": load_dashboard['_id']['$oid'],
                "load_station_id": route['load'],
                "lot_id": lot_id,
                "map_id": self.curr_map_id,
                "lot_number": lot['lotNum'],
                "notes": "",
                "product_group_id": lot['lotTemplateId'],
                "process_id": lot["process_id"],
                "quantity": quantity,
                "route_id": route['_id'],
                "type": "move",
                "sku": "default",
                "start_datetime": int(start_time)*1000, # Javascript stores timestamps in microsecond
                "move_datetime": int(move_time)*1000, # Javascript stores timestamps in microsecond
                "unload_station_id": route['unload'],
                "operator": operator,
                "pauses": [],
                "current_wip": wip
            }
                        
            self.request('POST', 'touch_events', touch_event)
            
    def finish_lot(self, lot, quantity, load_station, start_time, move_time, log_event=True, operator='Operator'):
        
        load_station_id = load_station['_id']
        
        # Bins contain the information about how many parts are at what station
        # Make sure this move event is valid
        bins = lot['bins']
        if load_station_id not in bins.keys():
            raise Exception('There are no parts of lot at route load station')
        elif bins[load_station_id]['count'] < quantity:
            raise Exception('Cannot move {} parts from lot when only {} parts exist at load station'.format(quantity, bins[load_station_id]['count']))
        
        # Set the new quantity at the unload station
        if 'FINISH' in bins.keys():
            bins['FINISH']['count'] += quantity
        else:
            bins['FINISH'] = {
                'count': quantity
            }
        
        # Subtract the move quantity from the load station, and delete that bin if it is now empty
        bins[load_station_id]['count'] -= quantity
        if bins[load_station_id]['count'] <= 0 and len(bins[load_station_id].keys()) == 1:
            del bins[load_station_id]
        
        # Update the lot in the DB
        lot['bins'] = bins  
        self.request('PUT', 'cards/{}'.format(lot['_id']), lot)
        
        # Log touch event
        if log_event:
            load_dashboard = self.get_dashboard_by_id(load_station['dashboards'][0])
            
            # Cumulative WIP at that station (by product group)
            wip = {}
            for station_lot in load_station['lots']:
                if station_lot['lotTemplateId'] in wip:
                    wip[station_lot['lotTemplateId']] += station_lot['bins'][load_station['_id']]['count']
                else:
                    wip[station_lot['lotTemplateId']] = station_lot['bins'][load_station['_id']]['count']
            
            touch_event = {
                "dashboard_id": load_dashboard['_id']['$oid'],
                "load_station_id": load_station_id,
                "lot_id": lot['_id'],
                "lot_number": lot['lotNum'],
                "notes": "",
                "map_id": self.curr_map_id,
                "product_group_id": lot['lotTemplateId'],
                "process_id": lot["process_id"],
                "quantity": quantity,
                "route_id": None,
                "type": "move",
                "sku": "default",
                "start_datetime": int(start_time)*1000, # Javascript stores timestamps in microsecond
                "move_datetime": int(move_time)*1000, # Javascript stores timestamps in microsecond
                "unload_station_id": 'FINISH',
                "operator": operator,
                "pauses": [],
                "current_wip": wip
            }
                            
            self.request('POST', 'touch_events', touch_event)
            
            
    def create_lot(self, lot, log_event=True, operator='Operator'):
        
        self.request('POST', 'cards', lot)
        

    def create_reportevent(self, report):
        self.request('POST','report_events', report)
            
    def create_lots(self, lots):
        for lot in lots:
            self.create_lot(lot)
            
    def kickoff_lot(self, lot, quantity, station_id, start_time, move_time, log_event=True, operator='Operator'):
        
        # Find station by ID
        station = self.get_station_by_id(station_id)
        if not station: raise Exception('Station not found')
        
        unload_station_id = station_id
        
        # Bins contain the information about how many parts are at what station
        # Make sure this move event is valid
        bins = lot['bins']
        if 'QUEUE' not in bins.keys():
            raise Exception('There are no parts of lot in the queue')
        elif bins['QUEUE']['count'] < quantity:
            raise Exception('Cannot move {} parts from lot when only {} parts exist at QUEUE'.format(quantity, bins['QUEUE']['count']))
        
        # Set the new quantity at the unload station
        if unload_station_id in bins.keys():
            bins[unload_station_id]['count'] += quantity
        else:
            bins[unload_station_id] = {
                'count': quantity
            }
        
        # Subtract the move quantity from the load station, and delete that bin if it is now empty
        bins['QUEUE']['count'] -= quantity
        if bins['QUEUE']['count'] <= 0 and len(bins['QUEUE'].keys()) == 1:
            del bins['QUEUE']
        
        # Update the lot in the DB
        lot['bins'] = bins  
        self.request('PUT', 'cards/{}'.format(lot['_id']), lot)
        
        # Log Event
        if log_event:
            kickoff_dashboard = self.get_dashboard_by_id(station['dashboards'][0])
            
            touch_event = {
                "dashboard_id": kickoff_dashboard['_id']['$oid'],
                "load_station_id": 'QUEUE',
                "lot_id": lot['_id'],
                "lot_number": lot['lotNum'],
                "map_id": self.curr_map_id,
                "notes": "",
                "product_group_id": lot['lotTemplateId'],
                "process_id": lot["process_id"],
                "quantity": quantity,
                "route_id": None,
                "type": "move",
                "sku": "default",
                "start_datetime": int(start_time)*1000, # Javascript stores timestamps in microsecond
                "move_datetime": int(move_time)*1000, # Javascript stores timestamps in microsecond
                "unload_station_id": station['_id'],
                "operator": operator,
                "pauses": [],
                "current_wip": {}
            }
                            
            self.request('POST', 'touch_events', touch_event)