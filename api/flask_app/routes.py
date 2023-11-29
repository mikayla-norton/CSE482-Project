from flask import current_app as app
from flask import render_template,redirect, request, session, url_for
import time
from .utils.database.database import database
from pprint import pprint
import json
import random
import functools

from AlgorithmScripts.project_pyscript import movie_based_recs

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


@app.route('/    data = request.get_json()', methods=['POST'])
def get_movie_based_recommendation():
    data = request.get_json()
    moviesList = data["movies"]
    print(moviesList)

    movieRecommendations = movie_based_recs(moviesList)
    print(movieRecommendations)

    return movieRecommendations


