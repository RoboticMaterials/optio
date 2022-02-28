#!/usr/bin/python

import argparse, sys
import json
from pymongo import MongoClient

client = MongoClient('localhost:27017')
db = client.ContactDB

parser = argparse.ArgumentParser()
parser.add_argument('--path', '-p', help="name of map json file", type=str)
parser.add_argument('--name', '-n', help="name of map to insert", type=str)
parser.add_argument('--delete', '-d', help="should a map of the same name be deleted", type=bool, default=False)
args=parser.parse_args()

with open('./maps/'+ args.path +'.json', 'r') as f:
  map = json.load(f)
  
if args.name is None: mapName = map['name']
else: mapName = args.name
map['name'] = mapName

if args.delete:
    db.site_maps.delete_many({'name': mapName})
db.site_maps.insert_one(map)
