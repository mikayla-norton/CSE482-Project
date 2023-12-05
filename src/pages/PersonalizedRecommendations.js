import React, {useEffect, useState} from 'react'
import SearchBar from './components/SearchBar';
import RatingMovie from './components/RatingMovie';
import {query, getDocs, collection, where, doc, updateDoc} from "firebase/firestore";
import {db} from "../firebaseConfig";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const tempMovieList = [
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


export default function PersonalizedRecommendations() {
    const [displayCount, setDisplayCount] = useState(8); // State to track the number of movies displayed
    const [results, setResults] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentTitle, setCurrentTitle] = useState("");
    const { currentUser, logOut } = useAuth();
    const navigate = useNavigate();
    const [ratedMovies, setRatedMovies] = useState([]);

    useEffect(() => {
        if (ratedMovies.length === 0 && currentUser) {
            getInitialUserMovies();
        }
    }, [ratedMovies])

    const getInitialUserMovies = async () => {
        let queryForUser = query(collection(db, "users"), where("email", "==", currentUser.email));
        let querySnapshot = await getDocs(queryForUser);
        let userDoc = querySnapshot.docs[0];
        let currentMoviesObj = userDoc.data().movies;
        let currentMovies = [];
        Object.keys(currentMoviesObj).forEach((key) => {
            currentMovies.push({
                title: key,
                rating: currentMoviesObj[key]
            });
        });
        if (currentMovies.length > 0) {
            setRatedMovies(currentMovies);
        }
    }

    const onMovieRated = (movieTitle, movieRating) => {
        // check that the movie is not already in the list
        let movieAlreadyRated = false;
        ratedMovies.forEach((movie) => {
            if (movie.title === movieTitle) {
                movieAlreadyRated = true;
            }
        });
        if (!movieAlreadyRated) {
            setRatedMovies(prevMovies => [...prevMovies, { title: movieTitle, rating: movieRating }]);
        } else {
            // Substitute the value of the rating
            let newRatedMovies = ratedMovies.map((movie) => {
                if (movie.title === movieTitle) {
                    return { title: movieTitle, rating: movieRating };
                } else {
                    return movie;
                }
            });
            setRatedMovies(newRatedMovies);
        }
    };

    const getUserRecommendations = async (movie) => {
        const userEmail = currentUser.email;
        let queryForUser = query(collection(db, "users"), where("email", "==", userEmail)); 
        let querySnapshot = await getDocs(queryForUser);
        let userDoc = querySnapshot.docs[0];

        let currentMoviesObj = userDoc.data().movies;

        let data= {
            "userMovies": currentMoviesObj,
        }
        console.log("data for user based:",data);

        let response = await fetch("http://localhost:8081/user-based-recommendation", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
        let recommendationsObj = await response.json();
        console.log(recommendationsObj);
        let recommendations = [];
        Object.keys(recommendationsObj).forEach((key) => {
            recommendations.push([key, recommendationsObj[key]]);
        });
        recommendations.sort((a, b) => {
            return b[1] - a[1];
        });
        displayMovieRecommendations(recommendations);
    }
    
    const displayMovieRecommendations = (movies) => {
        navigate("/movie-recommendations-result", { state: { recommendation: "user", movies: movies } });
    }

    const toggleModal = (title) => {
        setCurrentTitle(title);
        setModalIsOpen(!modalIsOpen);
    }

    // Logout handler
    const handleLogout = async () => {
        try {
            await logOut();
            navigate('/login');
        } catch (error) {
            console.error('Logout Failed:', error);
        }
    };

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <section className='main-content'> 
            <div className="buttons-container">
                <button onClick={handleGoHome} className="home-button">Home</button>
                <button onClick={handleLogout} className="logout-button">Log Out</button>
            </div>
            <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> 
            <div className="absolute w-[80vw] bg-black text-white flex flex-col z-30 p-3 h-[80vh] justify-center items-center">
                <h1 className='text-2xl'>Personalized Picks</h1>
                <p className='text-lg'>Rate the following movies to get personalized recommendations</p>
                <div className="content-container" style={{ display: 'flex', justifyContent: 'space-between', maxHeight: '50%', margin:'5px' }}>
                    <div className='search-section' style={{ flex: 1, padding: '10px' }}>
                        <SearchBar onSearch={setResults} />
                        {results.map((title, index) => (
                            <button key={index} onClick={() => toggleModal(title)} className='p-2 bg-green'>
                                {title}
                            </button>
                        ))}
                    </div>
                    <div className='movie-ratings'>
                        {ratedMovies.length > 0 && (
                            <div className="rated-movies" style={{ flex: 1, maxHeight: '100%', width: '300px', padding: '10px', overflow: 'auto' }}>
                                {ratedMovies.map((movie, index) => (
                                    <div key={index} style={{ margin: '5px', border: '2px solid grey', wordWrap: 'break-word', padding: '5px'}}>
                                        <p>{movie.title} : <b>{movie.rating}</b></p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <button onClick={getUserRecommendations} className="home-button">
                    Get Recommendations
                </button>
            </div> 
            {
                modalIsOpen && <RatingMovie 
                                  modalIsOpen={modalIsOpen} 
                                  setModalIsOpen={setModalIsOpen} 
                                  currentTitle={currentTitle} 
                                  onMovieRated={onMovieRated} />
            }
        </section>
  );
}