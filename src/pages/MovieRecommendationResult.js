import { useLocation } from 'react-router-dom';
import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'

export default function MovieRecommendationResults() {
    const [displayCount, setDisplayCount] = useState(5); // State to track the number of movies displayed
    const navigate = useNavigate();
    const location = useLocation();
    const recommendation = location.state?.recommendation;
    const movies = location.state?.movies;

    const loadMoreMovies = () => {
        setDisplayCount(prevCount => prevCount + 5); // Increase the number of movies displayed by 5
    };

    return (
        <section className='main-content'>
            
            <div className="absolute w-[80vw] bg-black text-white flex flex-col z-30 p-3 h-[80vh] justify-center items-center"> 
                {
                    recommendation === "user" ? 
                    (
                        <h2 className='text-2xl mb-10'>Here are your movie recommendations based on your ratings</h2>
                    ) : 
                    (
                        <h2 className='text-2xl mb-10'>Here are recommended movies similar to the ones on your list</h2>
                    )
                }
                <div className='w-full flex flex-col items-center'  style={{ maxHeight: '50%', maxWidth: '80%', overflowY: 'auto' }}>
                    {movies?.slice(0, displayCount).map(([movie, rating], index) => (
                        <div key={index} className='bg-white text-black rounded-lg p-4 mb-2 w-3/4 md:w-1/2'>
                            {movie}
                        </div>
                    ))}
                    {displayCount < movies?.length && (
                        <button onClick={loadMoreMovies}>
                            Load More
                        </button>
                    )}
                </div>
                <button className='absolute bottom-3 right-3 p-2' onClick={() => navigate("/")}>
                    Back Home
                </button>
            </div>
        </section>
  )
}
