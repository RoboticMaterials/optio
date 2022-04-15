import json
from flask import Flask, jsonify, make_response, request, g
from idp import get_user
from wss import send_wss_message_to_group
from helpers import get_user_attribute

app = Flask(__name__)


class Abort401(Exception):
    pass


@app.errorhandler(Abort401)
def unauthorized_response(err):
    return make_response(jsonify(message='Unauthorized!'), 401)


@app.errorhandler(404)
def not_found_response():
    return make_response(jsonify(message='Not found!'), 404)


@app.before_request
def before_request():
    user = get_user(request.headers.get('Authorization', ''))
    if not user:
        raise Abort401
    g.user = user


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods',
                         'GET,PUT,POST,DELETE,OPTIONS')
    return response


@app.route("/hello")
def hello():
    groupname = get_user_attribute(g.user['UserAttributes'], 'name')
    send_wss_message_to_group(groupname, json.dumps({'type':'test', 'msg':'Hello from path!'}))
    return jsonify(message='Hello from path!')


import tasks
import stations
import settings
import processes
import positions
import lot_templates
import events
import dashboards
import development
import cards
