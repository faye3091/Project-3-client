import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";

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
      `https://imdb-api.com/en/API/InTheaters/k_dya52m29`
    );
    if (!response.ok) {
      throw new Error("something went wrong");
    }
    const { items } = await response.json();

    const movieData = await items.map((movie) => ({
      movieId: movie.id,
      movieTitle: movie.fullTitle,
      movieImage: movie.image,
    }));

    setMovies(movieData);

    console.log("Movies in Theaters:", movieData);

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

      //saveMovieIds(savedMovieIds);

    } catch (err) {
      console.error(err);
    }
  };
  
  return (
    <>
      <main>
        <div className="row justify-content-right">
          <div className="col-sm text-center">
            <Link className="btn btn-lg btn-info mb-4" to="/searchmovies">
              Search for Movies
            </Link>
          </div>
        </div>

        <div className="row justify-content-center mb-4">
          <div className="col-sm text-center">
            <h2>Movies in Theaters</h2>
          </div>
        </div>

        <div className="flex-row">
          <div className="col-sm-12">
            {!movies ? (
              <p>Searching.....</p>
            ) : (
              <div className="row text-center">
                {movies.map((movie, index) => (
                  <div key={index} className="col d-flex">
                    <div className="card mb-4" style={{ width: "22rem" }}>
                      <img
                        src={movie.movieImage}
                        alt={movie.movieTitle}
                        className="card-img-top"
                      />
                      <div
                        className="card-body"
                        style={{ position: "relative" }}
                      >
                        <h5 className="card-title" style={{marginBottom: "70px"} } >{movie.movieTitle}</h5>
                        {Auth.loggedIn() && (
                          <button
                            disabled={savedMovieIds?.some(
                              (savedId) => savedId === movie.movieId
                            )}
                            className="btn btn-block btn-primary"
                            onClick={() =>
                              handleSaveMovie(movie.movieId).then(
                                saveMovieIds(savedMovieIds)
                              )
                            }
                            style={{ width: "100%", position: "absolute", bottom: "1px", left: "1px"}}
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
      {error && (
        <div className="my-3 p-3 bg-danger text-white">
          Something went wrong
        </div>
      )}
    </>
  );
};

export default Home;