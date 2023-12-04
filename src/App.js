import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import './App.css';
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import HomePage from "./pages/HomePage";
import SimilarMovies from "./pages/SimilarMovies";
import PersonalizedRecommendations from "./pages/PersonalizedRecommendations";
import MovieRecommendationsResult from "./pages/MovieRecommendationResult"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/similar-movies" element={<SimilarMovies/>}/>
        <Route exact path="/personalized-recommendations" element={<PersonalizedRecommendations/>}/>
        <Route exact path="/movie-recommendations-result" element={<MovieRecommendationsResult/>}/>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
