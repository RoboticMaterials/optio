import os
import pymongo

# Get Amazon DocumentDB ceredentials from environment variables
username = os.environ.get('DB_MASTER_USER_NAME')
password = os.environ.get('DB_MASTER_USER_PASSWORD')
clusterendpoint = os.environ.get('DB_CLUSTER_ENDPOINT')

"""
Establish DocumentDB connection
https://raw.githubusercontent.com/aws-samples/amazon-documentdb-samples/master/samples/connect-and-query/sample_python_documentdb.py
"""
client = pymongo.MongoClient(clusterendpoint, username=username, password=password,
                             tls='true', tlsCAFile='rds-combined-ca-bundle.pem', retryWrites='false')
