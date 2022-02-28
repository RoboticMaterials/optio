
# def authenticate_token(token):
#     print('Token', token)
#     return {'scope': 'admin1'}


# import time
#
# # import connexion
# import six
# # from werkzeug.exceptions import Unauthorized
#
# from jose import JWTError, jwt

import demjson
import cognitojwt

with open('../src/settings/config.js', 'r') as conf:
    raw = conf.read()
    json_obj = raw[raw.find('{') : raw.rfind('}')+1].replace("'", '"')
    cognito_attributes = demjson.decode(json_obj)
        
    REQUIRE_AUTH = cognito_attributes['authenticationNeeded']
    USERPOOL_ID = cognito_attributes['UserPoolId']
    APP_CLIENT_ID = cognito_attributes['ClientId']
    REGION = cognito_attributes['Region']


def api_key_decode(api_key, required_scopes=None):

    if not REQUIRE_AUTH:
        return {'scope': 'admin'}

    try:
        result = cognitojwt.decode(
            api_key,
            REGION,
            USERPOOL_ID,
            app_client_id=APP_CLIENT_ID,  # Optional
            testmode=True  # Disable token expiration check for testing purposes
        )
        
        return {'scope': 'admin'}

    except Exception:
        return None
