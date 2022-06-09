from flask import make_response, abort
from bson.json_util import dumps
import boto3


def authenticate(credentials):
    print(credentials)
    client = boto3.client('cognito-idp', credentials["region_name"])

    resp = client.initiate_auth(
        # UserPoolId=user_pool_id,
        ClientId=credentials["app_client_id"],
        AuthFlow='USER_PASSWORD_AUTH',
        AuthParameters={
            "USERNAME": credentials["username"],
            "PASSWORD": credentials["password"]
        }
    )
    
    return resp['AuthenticationResult']['IdToken']
