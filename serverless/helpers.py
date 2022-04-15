import json
from logger import logger


def get_response(status_code, body):
    if not isinstance(body, str):
        body = json.dumps(body)
    response = {"statusCode": status_code, "body": body}
    logger.info(f'get_response - result - {response}')
    return response


def parse_json(str):
    try:
        return json.loads(str)
    except ValueError:
        logger.info("event body could not be JSON decoded.")
        return {}


def get_user_attribute(attributes, name):
    for data in attributes:
        if data['Name'] == 'name':
            return data['Value']
