import React, {useEffect, useState} from 'react'
import SearchBar from './components/SearchBar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


/**
 * Uses the search bar component to get a list of movies
 * and then uses the list of movies to get recommendations
 * It does the movie based recomendation 
 * @returns 
 */
export default function SimilarMovies() {
    const [results, setResults] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [movies, setMoviesList] = useState([]);  // clear out the list inside later when connected to backend
    const navigate = useNavigate();
    const { logOut } = useAuth();

    console.log(results);

    /**
     * 
     * @param movies: list of movies to get recommendations for
     */
    const getMovieBasedRecommendations = async (movies) => {
        try {
            console.log(movies)
            let listofMovies = movies;
            let obj = {
                "movies": listofMovies,
            }
            let response = await fetch("http://localhost:8081/movie-based-recommendation", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj),
            })
            let json = await response.json();
            // Make my json a list of movies with a list of lists of (movie, rating)
            let finalMovieList = [];
            Object.keys(json).forEach((key) => {
                finalMovieList.push([key, json[key]]);
            });
            // Sort the list of movies by rating
            finalMovieList.sort((a, b) => {
                return b[1] - a[1];
            });
            console.log(json);
            displayMovieRecommendations(finalMovieList);
        } catch (error) {
            console.log(error)
        }
    }

    const displayMovieRecommendations = (movies) => {
        navigate("/movie-recommendations-result", { state: { recommendation: "movie", movies: movies } });
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
        navigate('/'); // Navigate to home page
    };


    return (
        <section className='main-content'> 
            <div className="buttons-container">
                <button onClick={handleGoHome} className="home-button">Home</button>
                <button onClick={handleLogout} className="logout-button">Log Out</button>
            </div>
            <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> 
            <div className="absolute w-[80vw] bg-black text-white flex flex-col gap-3 z-30 p-3 h-[80vh] justify-center items-center"> 
                <h1 className='text-2xl'>Find similar movies</h1>
                <p className='text-lg'>Enter a movie title to find similar movies</p>
                <div className="content-container" style={{ display: 'flex', justifyContent: 'space-between', maxHeight: '50%', margin:'5px' }}>
                    <div className='search-section'  style={{ flex: 1, padding: '10px' }}>
                        <SearchBar onSearch={setResults}/>
                        <div className='flex flex-col gap-3 justify-center items-center text-black'>
                            {results.map((title, index) => (
                                <div key={index} className='flex flex-row gap-3 p-2 bg-gray-100 rounded-md'>
                                    <button  className=''>
                                        {title}
                                    </button>
                                    <button  onClick={() => {setMoviesList([...movies, title])}}  className="home-button">
                                        Add
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='added-movies'>
                        {movies.length > 0 && (
                            <div className="added-movies" style={{ flex: 1, maxHeight: '100%', width: '300px', padding: '10px', overflow: 'auto' }}>
                                <h2 style={{ margin: '5px'}}>Movies Added</h2>
                                {movies.map((movie, index) => (
                                    <p key={index} style={{ margin: '5px', border: '2px solid grey', wordWrap: 'break-word', padding: '5px'}}>{movie}</p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <button onClick={() => {getMovieBasedRecommendations(movies)}} className="home-button">
                    Get Recommendations
                </button>
            </div> 
        </section>
  )
}