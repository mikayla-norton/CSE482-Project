import os
from flask import Flask
from flask_failsafe import failsafe
from flask_cors import CORS

@failsafe
def create_app():
    app = Flask(__name__)
    CORS(app)
    with app.app_context():
        from . import routes
        return app