from pymongo import MongoClient

client = MongoClient('localhost:27017')
db = client.ContactDB

def clear_map(map_id, password):
    if password == 'R0boticmaterials!':
        
        db.processes.delete_many({'map_id': map_id})
        db.tasks.delete_many({'map_id': map_id})
        db.stations.delete_many({'map_id': map_id})
        db.dashboards.delete_many({'map_id': map_id})
        db.lot_templates.delete_many({'map_id': map_id})
        
        db.touch_events.delete_many({'map_id': map_id})
        db.station_summaries.delete_many({'$or': [{'map_id': map_id}, {'map_id': {'$exists': False}}]})
        db.process_summaries.delete_many({'$or': [{'map_id': map_id}, {'map_id': {'$exists': False}}]})
        
        success = True
    else: 
        success = False
    
    
    return success