from flask import current_app as app, jsonify
from flask import render_template,redirect, request, session, url_for
import time
from .utils.database.database import database
from pprint import pprint
import json
import random
import functools
import pandas as pd

class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        try:
            node = self.root
            for char in word:
                if char not in node.children:
                    node.children[char] = TrieNode()
                node = node.children[char]
            node.is_end_of_word = True
        except:
            print("Error inserting word")

    def search(self, prefix, n):
        try: 
            results = []
            node = self.root
            for char in prefix:
                if char in node.children:
                    node = node.children[char]
                else:
                    return results
            self._dfs(node, prefix, results, n)
            return results
        except:
            print("Error searching for prefix")
            return []

    def _dfs(self, node, prefix, results, n):
        if len(results) == n:
            return
        if node.is_end_of_word:
            results.append(prefix)
        for char in node.children:
            self._dfs(node.children[char], prefix + char, results, n)

# Initialize trie
trie = Trie()
print("Loading movie titles...")
df = pd.read_csv('/Users/joelnataren9/CSE482-Project/api/AlgorithmScripts/movie.csv')
for title in df['title']:
    trie.insert(title.lower())
from AlgorithmScripts.project_pyscript import movie_based_recs
print("Done loading movie titles.")

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


@app.route("/movie-based-recommendation", methods=['POST'])
def get_movie_based_recommendation():
    data = request.get_json()
    moviesList = data["movies"]
    print(moviesList)

    movieRecommendations = movie_based_recs(moviesList)
    print(movieRecommendations)

    return movieRecommendations


@app.route('/search')
def search_movies():
    query = request.args.get('query', '').lower()
    n = int(request.args.get('n', 5))  # Default to top 5 matches
    matches = trie.search(query, n)
    return jsonify(matches)
