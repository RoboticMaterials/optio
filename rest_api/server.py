"""
Main module of the server file
"""

from flask_cors import CORS
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


@application.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    return r
    

# gunicorn "server:create_app()"
def create_app():
    return application


if __name__ == "__main__":
    connex_app.run(debug=False)
