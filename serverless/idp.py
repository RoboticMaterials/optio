import re
import boto3
from logger import logger

# Cognito Identity Provider
idp = boto3.client('cognito-idp')


def get_user(token):
    token = re.sub(r'/bearer/ig', '', token)
    try:
        user = idp.get_user(AccessToken=token)
        logger.info(f'Authorized user - {user}')
        return user
    except Exception as e:
        logger.info(f'Error validating access token - {token} - {e}')
