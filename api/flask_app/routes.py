from flask import current_app as app
from flask import render_template,redirect, request, session, url_for
import time
from .utils.database.database import database
from pprint import pprint
import json
import random
import functools

db=database()

def login(func):
    @functools.wraps(func)
    def secure_function(*args, **kwargs):
        if "email" not in session:
            return redirect(url_for("login", next=request.url))
    return secure_function


@app.route('/time')
def get_current_time():
    return {'time': time.time()}


@app.route('/movie-based-recommendation')
def get_movie_based_recommendation(data):
    print(data)
    return {"data": {
        "test": "Yes"
    }}