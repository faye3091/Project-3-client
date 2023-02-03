import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";

import { SAVE_MOVIE } from "../utils/mutations";
import { QUERY_USER } from "../utils/queries";

import Auth from "../utils/auth";

const Home = () => {
  // get user data
  const { loading, data } = useQuery(QUERY_USER);

  const userData = data?.me || {};

  // Create state to hold movies in theater
  const [movies, setMovies] = useState([[]]);

  const [saveMovie, { error }] = useMutation(SAVE_MOVIE);

  // useEffect to search for movies in theaters only once
  useEffect(() => {
    searchMoviesInTheater()
  }, []);

  // Search movies in theaters function and set state
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

    // Save the chosen movie
    try {
      const { data } = await saveMovie({
        variables: { ...movieToSave },
      });

      console.log(data);

    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

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
                        {Auth.loggedIn() ? (
                          <h5
                            className="card-title"
                            style={{ marginBottom: "65px" }}
                          >
                            {movie.movieTitle}
                          </h5>
                        ) : (
                          <h5
                            className="card-title"
                          >
                            {movie.movieTitle}
                          </h5>
                        )}
                        
                        {Auth.loggedIn() && (
                          <button
                            disabled={userData.favoriteMovies?.some(
                              (favMovie) => favMovie.movieId === movie.movieId
                            )}
                            className="btn btn-block btn-primary"
                            onClick={() => handleSaveMovie(movie.movieId)}
                            style={{
                              width: "100%",
                              position: "absolute",
                              bottom: "1px",
                              left: "1px",
                            }}
                          >
                            {userData.favoriteMovies?.some(
                              (favMovie) => favMovie.movieId === movie.movieId
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