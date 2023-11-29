import React, {useEffect, useState} from 'react'

import {query, getDocs, collection, where, doc, updateDoc} from "firebase/firestore";
import {db} from "../firebaseConfig"


const RECOMMENDATION_OPTIONS = {
    none: "none",
    userBase: "userBase",
    movieBase: "movieBase"
}

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


export default function HomePage() {
    const [recommendationOption, setRecommendationOption] = useState(RECOMMENDATION_OPTIONS.none)
    const [newMovie, setNewMovie] = useState("")

    const addMovieToUser = async (movie) => {
        // Assuming the current user is logged in
        // TODO: Replace movie and rating for users input
        let placeHolderMovie = tempMovieList[0];
        let rating = 3; // TODO: Get the rating from the user

        let queryForUser = query(collection(db, "users"), where("email", "==", "joelnataren9@hotmail.com")); //TODO: Get the current user's email
        let querySnapshot = await getDocs(queryForUser);
        let userDoc = querySnapshot.docs[0];

        let currentMovies = userDoc.data().movies;
        currentMovies[placeHolderMovie] = rating;
        console.log(currentMovies);

        // Update the user's movies in the database
        await updateDoc(doc(db, "users", userDoc.id), {
            movies: currentMovies
        })

        // let response = fetch("/add-movie-to-user", )
    }

    const getMovieBasedRecommendations = async () => {
        // TODO: Get all movies from user by searching

        let listofMovies = tempMovieList.slice(0, 10);
        let data = {
            "movies": listofMovies,
        }
        let response = await fetch("http://localhost:8080/movie-based-recommendation", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
        let json = await response.json();
        console.log(json);
    }

    const handleSelection = async () => {
        // Assuming the current Selection is Movie Based
        let testMovieSelected = tempMovieList;
        let data = {
            "movies": testMovieSelected,
        }
        // let response = fetch("/movie-based-recommendation", )
    }
    return (
        <section className='main-content'> 
            <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> 
            <div className="absolute w-[80vw] bg-black text-white flex flex-col z-30 p-3 h-[80vh] justify-center items-center gap-3"> 
                <button onClick={handleSelection} className='p-2 bg-green-500 rounded-sm text-gray-700'>
                    Test movieBase
                </button>


                <input type='text' value={newMovie} onChange={(e) => {setNewMovie(e.target.value)}} placeholder='Movie to add' className='p-2 bg-green-500 rounded-sm text-gray-700 text-black' />
                <button onClick={addMovieToUser} className='p-2 bg-green-500 rounded-sm text-gray-700'>
                    Test adding movie
                </button>

                <button onClick={getMovieBasedRecommendations} className='p-2 bg-green-500 rounded-sm text-gray-700'>
                    Test movieBase recommendations
                </button>
            </div> 
        </section>
  )
}
