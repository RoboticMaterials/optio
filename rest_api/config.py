import os
import connexion
from flask_socketio import SocketIO

basedir = os.path.abspath(os.path.dirname(__file__))

# Create the connexion application instance
connex_app = connexion.App(__name__, specification_dir=basedir)

# Get the underlying Flask app instance
app = connex_app.app

# Create the shared SocketIO instance (attached to the app after CORS is applied in server.py)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')
