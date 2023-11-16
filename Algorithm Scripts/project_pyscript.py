# IMPORTS
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity


# FILES
ratings = pd.read_csv("C:/Users/19896/Downloads/archive (14)/rating.csv")
movies = pd.read_csv("C:/Users/19896/Downloads/archive (14)/movie.csv")

rating_piece = ratings.loc[:, ["userId", "movieId", "rating"]]
movie_piece = movies.loc[:, ["movieId", "title", "genres"]]
whole = pd.merge(rating_piece, movie_piece)
whole = whole.iloc[:1_000_000, :]


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


# CREATE DATAFRAMES OF CATEGORY, USER RATING, MOVIE RATEING
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
movies_cat_df.to_csv("MoviesCat.csv")

user_rating = whole.pivot_table(index=["userId"], columns=["title"], values="rating")
movie_rating = user_rating.T

ur_np = user_rating.astype("float").to_numpy()
mr_np = movie_rating.astype("float").to_numpy()
movies_cat = movies_cat_df.astype("int").to_numpy()
mov_np = np.where(movies_cat == 0, np.nan, movies_cat)


# CREATE DROPOUT FOR TRAIN SET TO JUDGE PROCESS
dropout_probability = 0.25
# Generate random mask based on dropout probability
dropout_mask = np.random.choice(
    [False, True], size=ur_np.shape, p=[dropout_probability, 1 - dropout_probability]
)
# Apply dropout by setting selected values to nan
ur_np_train = np.where(dropout_mask, ur_np, np.nan)


top_neighbors = [
    3,
    4,
    5,
    7,
]  # TESTED 1, 2, 3, 4, 5, 7, 10, 15, 20, 25 /50/75/100/200 ... progressivly worse
# USED TO ASSIGN INDICIES TO THE NUMPY ARRAY
index_lst = [num for num in range(ur_np_train.shape[0])]
# ADDING THE INDICIES
cols_windex = np.column_stack((index_lst, ur_np_train))
user_mae_storage = {}
for j, num_neighbors in enumerate(top_neighbors):
    # STORE RESULTS
    results = {}
    # ITERATE THROUGH THE NUMPY ARRAY, GRAB EACH ROW
    for i in range(cols_windex.shape[0]):
        if i < 100_000:  # 100_000
            # GRAB ROW
            row = cols_windex[i]
            # MASK ON NON NAN VALUES
            mask = ~np.isnan(row)
            # ONLY NON NAN VALUES
            vals = row[mask]
            # SELECTING COLUMNS BASED ON NON NAN OF THE ROW
            cols = cols_windex[:, mask]
            # DROP ANY ROWS THAT HAVE A NAN VALUE (ASSUMTION NOT A GOOD MATCH)
            no_nans = cols[~np.isnan(cols).any(axis=1)]
            # DROP IF THERE ARE MORE THAN 1000 ELIGIBLE
            if no_nans.shape[0] > 1000:
                no_nans = no_nans[
                    np.random.randint(0, high=no_nans.shape[0], size=1000), :
                ]
            # STORE INDEX OF ROWS THAT ARE SELECTED
            selected_idx = no_nans[:, 0]

            # DIFFERENCE BETWEEN SELECTED ROWS AND LOOP ROW
            diff = no_nans - vals
            # TAKING THE ABSOLUTE ROW SUM OF THE VALUES (NON INDEX)
            abs_diff = np.sum(np.abs(diff[:, 1:]), axis=1)

            # ADD ACTUAL INDEX BACK TO DATAFRAME
            idx_abs_diff = np.column_stack((selected_idx, abs_diff))
            # MASK TO REMOVE THE ORIGINAL ROW
            idx_abs_diff_mask = ~(idx_abs_diff[:, 0] == i)
            # REMOVE ORIGINAL ROW
            without_orig_col = idx_abs_diff[idx_abs_diff_mask, :]
            # SORT ASCENDING (MIN AT TOP)
            sorted_indicices = np.argsort(without_orig_col[:, 1])
            # SORTED DATAFRAME
            sorted_without_orig_col = without_orig_col[sorted_indicices]
            # ADD TOP 20 NEIGHBORS TO THE RESULTS FOR THE KEY OF ORIG ROW INX

            # TEST 10/25/50/75/100/200
            results[i] = sorted_without_orig_col[:num_neighbors, 0]

    # RESULTS DICT TO DATAFRAME
    results = pd.DataFrame.from_dict(results, orient="index")
    results.to_csv("Neighbors_" + str(num_neighbors) + ".csv")
    # TO NUMPY ARRAY
    user_neighbors = results.to_numpy()

    # MATRIX COMPLETION BASED ON NEIGHBORS
    completed_mat = {}
    for i in range(user_neighbors.shape[0]):
        completed_mat[i] = np.nanmean(
            ur_np[
                user_neighbors[i, 1:][~np.isnan(user_neighbors[i, 1:])].astype("int"), :
            ],
            axis=0,
        )
    # SAVE COMPLETED MATRIX
    completed_mat_results = pd.DataFrame.from_dict(completed_mat, orient="index")
    completed_mat = completed_mat_results.to_numpy()
    completed_mat_results.to_csv("CompletedMatrix" + str(num_neighbors) + ".csv")

    # USE DROPOUT MASK TO SELECT VALUES FROM completed_mat AND CALCULATE (PENALTY FOR INCOMPLETE MATRIX BAKED IN)
    user_mae_storage[str(num_neighbors)] = np.nanmean(
        np.abs(
            ur_np[:100_000, :][dropout_mask[:100_000, :]]
            - completed_mat[dropout_mask[:100_000, :]]
        )
    )
mae_storage_df = pd.DataFrame.from_dict(user_mae_storage, orient="index")
mae_storage_df.to_csv("mae_storage.csv")


# COSINE SIMULARITY MATRIX OF MOVIES
cos_sim_ofmovies = pd.DataFrame(
    cosine_similarity(movies_cat_df),
    index=user_rating.columns,
    columns=user_rating.columns,
)


# RESET AND DROP
user_rating = user_rating.reset_index()
userId = user_rating.pop("userId")
# avg = np.nanmean(user_rating.to_numpy())
# CRATE NP ARRAYS
user_rating_5mask = (user_rating == 5).to_numpy()
user_rating_4mask = (user_rating == 4).to_numpy()
user_rating_2mask = (user_rating == 2).to_numpy()
user_rating_1mask = (user_rating == 1).to_numpy()


# FUNCTIONS FOR MATCHING MOVIES BASED ON SIMULARITY TO MOVIES THEY LIKED (5/4) AND DISIMULARITY TO MOVIES THE DIDNT LIKE (1/2)
def match5(user_num):
    max_sim = 0
    for i, title_liked in enumerate(
        user_rating.loc[user_num, user_rating_5mask[user_num]].index
    ):
        for j, title_notseen in enumerate(
            user_rating.loc[user_num, ~user_rating_5mask[user_num]].index
        ):
            cos_sim_score = cos_sim_ofmovies.at[title_liked, title_notseen]
            if max_sim < cos_sim_score:
                max_sim = cos_sim_score
                movie_based_user_recs[user_num] = (title_notseen, 5 * max_sim)


def match4(user_num):
    max_sim = 0
    for i, title_liked in enumerate(
        user_rating.loc[user_num, user_rating_4mask[user_num]].index
    ):
        for j, title_notseen in enumerate(
            user_rating.loc[user_num, ~user_rating_4mask[user_num]].index
        ):
            cos_sim_score = cos_sim_ofmovies.at[title_liked, title_notseen]
            if max_sim < cos_sim_score:
                max_sim = cos_sim_score
                movie_based_user_recs[user_num] = (title_notseen, 4 * max_sim)


def match1(user_num):
    min_sim = 5
    for i, title_disliked in enumerate(
        user_rating.loc[user_num, user_rating_1mask[user_num]].index
    ):
        for j, title_notseen in enumerate(
            user_rating.loc[user_num, ~user_rating_1mask[user_num]].index
        ):
            cos_sim_score = cos_sim_ofmovies.at[title_disliked, title_notseen]
            if min_sim > cos_sim_score:
                min_sim = cos_sim_score
                movie_based_user_recs[user_num] = (title_notseen, 5 * (1 - min_sim))


def match2(user_num):
    min_sim = 5
    for i, title_disliked in enumerate(
        user_rating.loc[user_num, user_rating_2mask[user_num]].index
    ):
        for j, title_notseen in enumerate(
            user_rating.loc[user_num, ~user_rating_2mask[user_num]].index
        ):
            cos_sim_score = cos_sim_ofmovies.at[title_disliked, title_notseen]
            if min_sim > cos_sim_score:
                min_sim = cos_sim_score
                movie_based_user_recs[user_num] = (title_notseen, 4 * (1 - min_sim))


def match3(user_num):
    # Random Movie and data average ... no descernable features (in the scope of this project)
    movie_based_user_recs[user_num] = (
        *user_rating.columns[np.random.randint(0, 32, size=1)],
        3.5,
    )


movie_based_user_recs = {}
# WANT TO FILTER FOR WHAT THEY LIKED AND USE OPPOSITE OF DISLIKE AS RESULTS
for user_num in range(user_rating.shape[0]):
    if user_num < 100_000:
        if not user_rating.loc[user_num, user_rating_5mask[user_num]].index.empty:
            match5(user_num)
        elif not user_rating.loc[user_num, user_rating_4mask[user_num]].index.empty:
            match4(user_num)
        elif not user_rating.loc[user_num, user_rating_1mask[user_num]].index.empty:
            match1(user_num)
        elif not user_rating.loc[user_num, user_rating_2mask[user_num]].index.empty:
            match2(user_num)
        else:
            match3(user_num)

user_recs_df = pd.DataFrame.from_dict(movie_based_user_recs, orient="index")
# ADD ONE TO USER TO GET THE USER ID
user_recs_df.index = user_recs_df.index + 1
user_recs_df.columns = ["Movie", "Score"]
user_recs_df.to_csv("MovieBasedUserRecs.csv")


# ADD IN ID COLUMN
user_recs_df["userId"] = user_recs_df.index
# RENAME DF COLUMNS
# BEST ONE
completed_mat_results = pd.read_csv(
    "C:/Users/19896/Downloads/vs_code/CompletedMatrix4.csv"
)
completed_mat_results = completed_mat_results.iloc[:, 1:]
completed_mat_results.columns = cos_sim_ofmovies.columns
completed_mat_results.index = completed_mat_results.index + 1


# TAKE AVERAGE OF MOVIE REC AND USER REC, COMPUTE MAE TO COMPARE TO PURE MOVIE REC OR USER REC
for index, row in user_recs_df.iterrows():
    completed_mat_results.at[row["userId"], row["Movie"]] = (
        completed_mat_results.at[row["userId"], row["Movie"]] + row["Score"]
    ) / 2
hybrid_mae_storage = np.nanmean(
    np.abs(
        ur_np[:100_000, :][dropout_mask[:100_000, :]]
        - completed_mat_results.to_numpy()[dropout_mask[:100_000, :]]
    )
)
# MAE OF HYBRID STRATEGY #THIS VERSION OF A HYBRID STRATEGY PERFORMED WORSE WITH THE SAME DROPOUT MASK
hybrid_mae_storage  # 0.37803204817203123


# NEXT STEPS -- TAKE IN MOVIE SCORES/SOMETHING LIKE, RETURN "BEST" MOVIE
# MONDAY AFTER CLASS
