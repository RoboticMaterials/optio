"""
Main module of the server file
"""
from pprint import pprint
from flask import g
from flask_cors import CORS, cross_origin
from numpy import broadcast
from flask_socketio import SocketIO
from werkzeug.middleware.proxy_fix import ProxyFix

# local modules
import config

# Get the application instance
connex_app = config.connex_app

CORS(connex_app.app)


# Read the swagger.yml file to configure the endpoints
connex_app.add_api("swagger.yml")

application = connex_app.app # expose global WSGI application object
application.wsgi_app = ProxyFix(application.wsgi_app)

socketio = SocketIO(application, cors_allowed_origins="*", async_handlers=True, async_mode='eventlet')
# socketio.init_app(application, cors_allowed_origins="*")

@application.before_request
def assing_socket():
    """
    We need each module to have access to the socket (to emit) so we attach it to the flask global object.
    This variable is reset on each new rest connection so we have to assign it before each request. This
    is not the best solution but will work short term.
    """
    g.socket = socketio


if __name__ == "__main__":
    socketio.run(application, debug=True)
