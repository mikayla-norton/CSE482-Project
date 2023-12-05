from AlgorithmScripts.project_pyscript import movie_based_recs, user_based_recs
from AlgorithmScripts.project_pyscript import movie_based_recs
from flask import current_app as app, jsonify
from flask import render_template, redirect, request, session, url_for
import time
from .utils.database.database import database
from pprint import pprint
import json
import random
import functools
import pandas as pd
import os

# Set to True to use the reduced movie list below, False to use the whole csv
reducedMovieList = True
allowedMovieList = [
    "2001: A Space Odyssey (1968)",
    "Blade Runner (1982)",
    "City of Lost Children, The (Cité des enfants perdus, La) (1995)",
    "Clerks (1994)",
    "Die Hard (1988)",
    "Dragonheart (1996)",
    "E.T. the Extra-Terrestrial (1982)",
    "Escape to Witch Mountain (1975)",
    "Fish Called Wanda, A (1988)",
    "Interview with the Vampire: The Vampire Chronicles (1994)",
    "Jumanji (1995)",
    "Léon: The Professional (a.k.a. The Professional) (Léon) (1994)",
    "Mask, The (1994)",
    "Monty Python and the Holy Grail (1975)",
    "Monty Python's Life of Brian (1979)",
    "One Flew Over the Cuckoo's Nest (1975)",
    "Platoon (1986)",
    "Pulp Fiction (1994)",
    "Raiders of the Lost Ark (Indiana Jones and the Raiders of the Lost Ark) (1981)",
    "Reservoir Dogs (1992)",
    "Rob Roy (1995)",
    "Rumble in the Bronx (Hont faan kui) (1995)",
    "Seven (a.k.a. Se7en) (1995)",
    "Shawshank Redemption, The (1994)",
    "Silence of the Lambs, The (1991)",
    "Star Wars: Episode IV - A New Hope (1977)",
    "Star Wars: Episode V - The Empire Strikes Back (1980)",
    "Terminator 2: Judgment Day (1991)",
    "Twelve Monkeys (a.k.a. 12 Monkeys) (1995)",
    "Usual Suspects, The (1995)",
    "What's Eating Gilbert Grape (1993)",
    "Wizard of Oz, The (1939)",
]


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

if not reducedMovieList:
    df = pd.read_csv(os.path.join(os.path.dirname(__file__),
                                  '..', 'AlgorithmScripts', 'movie.csv'))

    for title in df['title']:
        trie.insert(title.lower())
else:
    for title in allowedMovieList:
        trie.insert(title.lower())

print("Done loading movie titles.")

db = database()


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


@app.route("/user-based-recommendation", methods=['POST'])
def get_user_based_recommendation():
    data = request.get_json()
    userInputs = data["userMovies"]
    print(userInputs)
    userRecommendations = user_based_recs(userInputs)
    # replace all non integer values with 0 from my dictionary of recommendations
    for key in userRecommendations:
        print(pd.isna(userRecommendations[key]))
        if (pd.isna(userRecommendations[key])):
            userRecommendations[key] = 0.0
    return userRecommendations


@app.route('/search')
def search_movies():
    query = request.args.get('query', '').lower()
    n = int(request.args.get('n', 5))  # Default to top 5 matches
    matches = trie.search(query, n)
    return jsonify(matches)
