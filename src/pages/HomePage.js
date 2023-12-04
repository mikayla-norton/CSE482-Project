import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'

import {query, getDocs, collection, where, doc, updateDoc} from "firebase/firestore";
import {db} from "../firebaseConfig"


const RECOMMENDATION_OPTIONS = {
    none: "none",
    userBase: "userBase",
    movieBase: "movieBase"
}

// TODO: CHange email constant to the current user's email
const EMAIL = "joelnataren9@hotmail.com"

export default function HomePage() {
    const [recommendationOption, setRecommendationOption] = useState(RECOMMENDATION_OPTIONS.none)
    const navigate = useNavigate();


// rgb(162, 0, 255)
    return (
        <section className='main-content'> 
            <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> 
            <div className="absolute w-[80vw] bg-black text-white flex flex-col z-30 p-3 h-[80vh] justify-center items-center"> 
                <h1 style={{ fontSize: '250%', fontWeight: 'bold', margin: '5%', color: '#fff', textShadow: `0 0 7px rgba(162, 0, 255, 0.8), 0 0 10px rgba(162, 0, 255, 0.8), 0 0 21px rgba(162, 0, 255, 0.8), 0 0 42px rgba(162, 0, 255, 0.8), 0 0 82px rgba(162, 0, 255, 0.8), 0 0 92px rgba(162, 0, 255, 0.8), 0 0 102px rgba(162, 0, 255, 0.8), 0 0 151px rgba(162, 0, 255, 0.8)` }}>
                    Welcome, { EMAIL }
                </h1>
                <button onClick={() => navigate("/similar-movies")} className='p-2 bg-green'>
                    Recommendations from your favorite movie
                </button>
                <button onClick={() => navigate("/personalized-recommendations")} className='p-2 bg-green'>
                    Personalized Recommendations
                </button>
            </div> 
        </section>
  )
}
