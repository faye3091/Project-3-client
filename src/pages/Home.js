import React, { useState, useEffect } from "react";

import { useMutation } from "@apollo/client";
import { SAVE_MOVIE } from "../utils/mutations";
import { saveMovieIds, getSavedMovieIds } from "../utils/localStorage";

import Auth from "../utils/auth";

const Home = () => {
  // Create state to hold movies in theater
  const [movies, setMovies] = useState([[]]);

  // Create state hold saved movieIds values
  const [savedMovieIds, setSavedMovieIds] = useState(getSavedMovieIds);

  const [saveMovie, { error }] = useMutation(SAVE_MOVIE);

  // useEffect to search for movies in theater only once
  useEffect(() => {
    searchMoviesInTheater();
  }, []);

  // Search movies in theater function
  const searchMoviesInTheater = async () => {
    const response = await fetch(
      `https://imdb-api.com/en/API/InTheaters/k_h0j7l9s3`
    );
    if (!response.ok) {
      throw new Error("something went wrong");
    }
    const { items } = await response.json();

    console.log(items);

    const movieData = items.map((movie) => ({
      movieId: movie.id,
      movieTitle: movie.fullTitle,
      movieImage: movie.image,
    }));

    setMovies(movieData);
  };

  // 
  const handleSaveMovie = async (movieId) => {
    const movieToSave = movies.find((movie) => movie.movieId === movieId);

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    // Save the movie
    try {
      const { data } = await saveMovie({
        variables: { ...movieToSave },
      });
      console.log(data);
      setSavedMovieIds([...savedMovieIds, movieToSave.movieId]);
      saveMovieIds(savedMovieIds);
    } catch (err) {
      console.error(err);
    }
  };
  
  return (
    <main>
      <div className="flex-row justify-text-center">
        <h1>Movies in Theater</h1>
      </div>
      <div className="flex-row">
        <div className="col-12 col-lg-10">
          {!movies ? (
            <p>Loading.....</p>
          ) : (
            <div className="row row-cols-3">
              {movies.map((movie, index) => (
                <div key={index} className="col d-flex">
                  <div className="card mb-4" style={{ width: "22rem" }}>
                    <img
                      src={movie.movieImage}
                      alt={movie.movieTitle}
                      className="card-img-top"
                    />
                    <div className="card-body">
                      <h5 className="card-title">{movie.movieTitle}</h5>
                      {Auth.loggedIn() && (
                        <button
                          disabled={savedMovieIds?.some(
                            (savedId) => savedId === movie.movieId
                          )}
                          className="btn btn-block btn-primary"
                          onClick={() => handleSaveMovie(movie.movieId)}
                          style={{ width: "100%" }}
                        >
                          {savedMovieIds?.some(
                            (savedId) => savedId === movie.movieId
                          )
                            ? "Movie Already Saved!"
                            : "Save This Movie!"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;