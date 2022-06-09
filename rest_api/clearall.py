from pymongo import MongoClient

client = MongoClient('localhost:27017')
db = client.ContactDB

collection = db.site_maps


site_maps = collection.find()

for map_id in site_maps:        
	db.processes.delete_many({'map_id': map_id})
	db.tasks.delete_many({'map_id': map_id})
	db.stations.delete_many({'map_id': map_id})
	db.dashboards.delete_many({'map_id': map_id})
	db.lot_templates.delete_many({'map_id': map_id})
     
	db.touch_events.delete_many({'map_id': map_id})
	db.station_summaries.delete_many({'$or': [{'map_id': map_id}, {'map_id': {'$exists': False}}]})
	db.process_summaries.delete_many({'$or': [{'map_id': map_id}, {'map_id': {'$exists': False}}]})
