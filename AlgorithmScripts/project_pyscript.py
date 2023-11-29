# IMPORTS
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity


# FILES
ratings = pd.read_csv("/Users/joelnataren9/CSE482-Project/Algorithm Scripts/rating.csv")
movies = pd.read_csv("/Users/joelnataren9/CSE482-Project/Algorithm Scripts/movie.csv") ##Use your local path

rating_piece = ratings.loc[:, ["userId", "movieId", "rating"]]
movie_piece = movies.loc[:, ["movieId", "title", "genres"]]
whole = pd.merge(rating_piece, movie_piece)
whole = whole.iloc[:1_000_000, :]


user_rating = whole.pivot_table(index=["userId"], columns=["title"], values="rating")
user_rating.index = [num for num in range(user_rating.shape[0])]
ur_np = user_rating.astype("float").to_numpy()


def user_based_recs(user_rating, user_inputs, num_neighbors=4, num_to_return=5):
    """Given a user input, return move reccomendations

    Parameters
    ----------
    user_rating : pd.DataFrame()
        Pivot table of userId as index and title as columns, values as review score
    user_inputs : dict
        Key as movie title and value as score
    num_neighbors : int
        Number of neighbors to consider when getting a score
    num_to_return : int
        Number of movie, value pairs to return as a reccomendation

    Returns
    -------
    sorted_recs : dict
        Key as movie title and value as score

    Example
    -------
    user_rating = whole.pivot_table(index=["userId"], columns=["title"], values="rating")
    user_inputs = {
    "Twelve Monkeys (a.k.a. 12 Monkeys) (1995)": 3,
    "Jumanji (1995)": 2,
    "City of Lost Children, The (Cité des enfants perdus, La) (1995)": 4,
    "Monty Python and the Holy Grail (1975)": 5,
    }

    user_based_recs(user_rating, user_inputs)
    """
    ## DATAFRAME MANIPULATIONS
    # Add user input to user ratings
    user_rating.loc[user_rating.shape[0], user_inputs.keys()] = user_inputs
    # Turn DF to np.array
    ur_np = user_rating.astype("float").to_numpy()
    # USED TO ASSIGN INDICIES TO THE NUMPY ARRAY
    index_lst = [num for num in range(ur_np.shape[0])]
    # ADDING THE INDICIES
    cols_windex = np.column_stack((index_lst, ur_np))

    ## ROW SELECTION MANIPULATIONS
    # Select last row (user input)
    row = cols_windex[-1]
    # Mask on non nan value
    mask = ~np.isnan(row)
    # Select only values
    vals = row[mask]
    # Select columns from whole np.array
    cols = cols_windex[:, mask]
    # Drop any rows with a nan value
    no_nans = cols[~np.isnan(cols).any(axis=1)]
    # Store idx of selected rows
    selected_idx = no_nans[:, 0]
    # Difference between selected rows and the user input row
    diff = no_nans - vals
    # Absolute row sum of the values
    abs_diff = np.sum(np.abs(diff[:, 1:]), axis=1)
    # Add actual index back to np.array
    idx_abs_diff = np.column_stack((selected_idx, abs_diff))
    # Remove the user input row (last row)
    without_orig_col = idx_abs_diff[:-1, :]
    # Sort Ascending
    sorted_indicices = np.argsort(without_orig_col[:, 1])
    # Sorted Dataframe
    sorted_without_orig_col = without_orig_col[sorted_indicices]
    # Select top 4 neighbors (results is their index)
    results = sorted_without_orig_col[:num_neighbors, 0]
    # Completed user row (values from neighbor means)
    completed_row = np.nanmean(ur_np[results.astype("int"), :], axis=0)
    # Reccommendation dictonary (key movie value rating)
    reccomendations = {
        key: value for key, value in zip(user_rating.columns, completed_row)
    }
    # Delete movies reviewed (already have seen)
    for key in user_inputs.keys():
        del reccomendations[key]
    # Sort dict and select top n
    sorted_reccs = dict(sorted(reccomendations.items(), key=lambda item: item[1]))
    # Return top n suggestions (list of tuples in descending order)
    return dict(list(sorted_reccs.items())[-num_to_return:][::-1])


user_inputs = {
    "Twelve Monkeys (a.k.a. 12 Monkeys) (1995)": 3,
    "Jumanji (1995)": 2,
    "City of Lost Children, The (Cité des enfants perdus, La) (1995)": 4,
    "Monty Python and the Holy Grail (1975)": 5,
}
check_func = user_based_recs(user_rating, user_inputs)
print(check_func)

# CREATE ON HOT OF CATEGORIES
unique = []
for genres in whole["genres"]:
    split = genres.split("|")
    for category in split:
        if category not in unique:
            unique.append(category)

cat_labels = {}
for category in unique:
    cat_labels[category] = []

for genres in whole["genres"]:
    split = genres.split("|")
    for key in cat_labels.keys():
        if key in split:
            cat_labels[key].append(key)
        else:
            cat_labels[key].append(np.nan)

temp = pd.DataFrame.from_dict(cat_labels)
temp = temp.fillna(0)
temp = temp.where(temp == 0, 1)
whole = pd.concat([whole, temp], axis=1)
whole = whole.drop("genres", axis=1)

categories = whole.iloc[:, 4:]
movies = whole.loc[:, "movieId"]
movies_cat = pd.concat([movies, categories], axis=1)
movies_cat = movies_cat.drop_duplicates()
movies_cat_df = movies_cat.set_index("movieId")

cos_sim_ofmovies = pd.DataFrame(
    cosine_similarity(movies_cat_df),
    index=user_rating.columns,
    columns=user_rating.columns,
)


def movie_based_recs(cos_sim_ofmovies, user_inputs, num_to_return=5):
    """Return the most similar movies to selected movie(s)

    Parameters
    ----------
    cos_sim_ofmovies : pd.DataFrame()
        Dataframe with values as consine similarity score
    user_inputs : list
        List of movie titles

    Returns
    -------
    `unnammed` : dict
        Key as movie title and value as score

    Example
    -------
    cos_sim_ofmovies = pd.DataFrame(
        cosine_similarity(movies_cat_df),
        index=user_rating.columns,
        columns=user_rating.columns,
    )
    user_inputs = ['2001: A Space Odyssey (1968)', 'Clerks (1994)']

    movie_based_recs(user_rating, user_inputs)
    """
    reccs = []
    for title in user_inputs:
        reccs.append(cos_sim_ofmovies.loc[cos_sim_ofmovies[title] > 0.0, title])
    return dict(
        pd.concat(reccs, axis=1)
        .drop(user_inputs, axis=0)
        .mean(axis=1)
        .nlargest(num_to_return)
    )


user_inputs = ["2001: A Space Odyssey (1968)", "Clerks (1994)"]
print(movie_based_recs(cos_sim_ofmovies, user_inputs))
