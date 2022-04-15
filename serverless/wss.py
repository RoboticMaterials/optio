import os
import boto3
from ddb import client
from logger import logger

# Environment variables
WEBSOCKET_API_ENDPOINT = os.environ.get('WEBSOCKET_API_ENDPOINT')

# Connections DB/Table
db = client.ConnectionsDB
collection_wss_connections = db.wss_connections

# ApiGatewayManagementApi
apigatewaymanagementapi = boto3.client(
    "apigatewaymanagementapi", endpoint_url=WEBSOCKET_API_ENDPOINT)


def send_wss_message(connection_id, data):
    try:
        return apigatewaymanagementapi.post_to_connection(ConnectionId=connection_id,
                                                          Data=data.encode('utf-8'))
    except Exception as e:
        logger.info(f'send_ws_message - error - {e}')


def send_wss_message_to_group(groupname, data):
    active_connections = collection_wss_connections.find(
        {'groupname': groupname})
    for connection in active_connections:
        logger.info(f'Notifying connection {connection}')
        send_wss_message(connection['connection_id'], data)
