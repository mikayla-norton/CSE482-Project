import React, {useEffect, useState} from 'react'
import {query, getDocs, collection, where, doc, updateDoc} from "firebase/firestore";
import {db} from "../../firebaseConfig"


// TODO: CHange email constant to the current user's email
const EMAIL = "joelnataren9@hotmail.com"

export default function RatingMovie(props) {

    const ratings = [1, 2, 3, 4, 5];
    const [rating, setRating] = useState(0);

    const closeModal = () => {
        props.setModalIsOpen(false);
    }

    const handleClick = (e) => {
        // make it a number
        let intRating = parseInt(e.target.innerText);
        setRating(intRating);
    
        // callback function passed from PersonalizedRecommendations
        props.onMovieRated(props.currentTitle, intRating);
    }

    const addRatingToUser = async (movie, rating) => {
        let queryForUser = query(collection(db, "users"), where("email", "==", EMAIL)); //TODO: Get the current user's email
        let querySnapshot = await getDocs(queryForUser);
        let userDoc = querySnapshot.docs[0];

        let currentMovies = userDoc.data().movies;
        currentMovies[props.currentTitle] = rating;

        // Update the user's movies in the database
        await updateDoc(doc(db, "users", userDoc.id), {
            movies: currentMovies
        })
    }
        
    useEffect(() => {
        if (rating !== 0) {
            addRatingToUser(props.currentTitle, rating);
        }
    }, [rating]);


    return (
        <div className={`z-40 flex justify-center items-center fixed inset-0  ${props.modalIsOpen ? '' : 'pointer-events-none'}`}>

            <div className={`z-40 fixed inset-0 bg-black z-20 ${props.modalIsOpen ? 'opacity-70' : 'pointer-events-none opacity-0'}`} onClick={closeModal} />

            <div className={`z-40 absolute m-auto bg-purple-500 max-h-[95vh] rounded-2xl p-14 px-20 ${props.modalIsOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
                <div className="z-30 flex flex-col text-center text-white items-center overflow-y-auto justify-start gap-7">
                    <h1 className='text-2xl'> {`Rate the movie: ${props.currentTitle}`} </h1>
                    <p className='text-lg'>Rate the movie to get personalized recommendations</p>
                    <div className='flex flex-row gap-3'>
                        {
                            ratings.map((rating, index) => (
                                <button onClick={handleClick} key={index} className='p-3 bg-green border border-gray-200 rounded-md'>
                                    {rating}
                                </button>
                            ))
                        }
                    </div>
                    <button onClick={closeModal} className='p-2 bg-green'>
                        Done
                    </button>
                </div>
            </div>
        </div>
    )
}
