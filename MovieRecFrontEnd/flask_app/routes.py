from flask import current_app as app
from flask import render_template,redirect, request, session, url_for
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

@app.route('/')
def root():
    return redirect('/login')

@app.route('/home')
def home():
    return render_template('home.html', user=session)


@app.route('/login')
def login():
    return render_template('login.html')


@app.route('/signup')
def signup():
    return render_template('signup.html')