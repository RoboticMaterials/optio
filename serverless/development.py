from app import app
from ddb import client

db = client.ContactDB


@app.route('/development/clear/<string:map_id>', methods=['DELETE'])
def development_clear_map(map_id, password):
    if password == 'R0boticmaterials!':

        db.processes.delete_many({'map_id': map_id})
        db.tasks.delete_many({'map_id': map_id})
        db.stations.delete_many({'map_id': map_id})
        db.dashboards.delete_many({'map_id': map_id})
        db.lot_templates.delete_many({'map_id': map_id})

        db.touch_events.delete_many({'map_id': map_id})
        db.station_summaries.delete_many(
            {'$or': [{'map_id': map_id}, {'map_id': {'$exists': False}}]})
        db.process_summaries.delete_many(
            {'$or': [{'map_id': map_id}, {'map_id': {'$exists': False}}]})

        success = True
    else:
        success = False

    return success
