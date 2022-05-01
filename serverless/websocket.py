import json
from logger import logger
from idp import get_user
from helpers import parse_json, get_response, get_user_attribute
from wss import collection_wss_connections, send_wss_message_to_group


def connect(event, context):
    """
    Received new websocket connection request
    This will be triggered only when a valid Cognito auth token is provided

    Fetch the Cognito user and store connection id, username and groupname
    into connections table - this will enable support for multi-tenant
    """
    logger.info(f'Received new connect event {event}')

    token = event['headers']['Sec-WebSocket-Protocol'] if 'Sec-WebSocket-Protocol' in event['headers'] else ''
    user = get_user(token)
    if not user:
        return get_response(401, 'Unauthorized!')

    username = user['Username']
    groupname = get_user_attribute(user['UserAttributes'], 'name')
    connection_id = event["requestContext"].get("connectionId")

    payload = {'connection_id': connection_id,
               'username': username, 'groupname': groupname}
    logger.info(f'New connection - {payload}')
    collection_wss_connections.insert_one(payload)

    return get_response(200, 'Connected!')


def disconnect(event, context):
    """
    Received new websocket disconnect request
    Remove the connection id from the connections table
    """
    logger.info(f'Received new disconnect event {event}')
    collection_wss_connections.delete_many(
        {'connection_id': event["requestContext"].get("connectionId")})
    return get_response(200, 'Disconnected!')


def default_message(event, context):
    """
    Received new event on the default message route

    The event will have the Cognito groupname
    Fetch all active connection ids for the cognito group and notify all users
    """
    logger.info(f'Received new message event {event}')

    body = parse_json(event.get('body', ''))
    type = body['type'] if 'type' in body else None
    groupname = body['groupname'] if 'groupname' in body else None

    if not type or not groupname:
        return get_response(200, 'Empty type / groupname')

    send_wss_message_to_group(groupname, json.dumps(body))

    return get_response(200, 'Notified!')
