import React, { useState } from "react";
import { useMutation } from "@apollo/client";

import { SAVE_MOVIE } from "../utils/mutations";
import { saveMovieIds, getSavedMovieIds } from "../utils/localStorage";
import Auth from "../utils/auth";


const SearchMovies = () => {
  // create state for holding returned movie api data
  const [searchedMovies, setSearchedMovies] = useState([]);

  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");

  // create state to hold saved movieId values
  const [savedMovieIds, setSavedMovieIds] = useState(getSavedMovieIds());

  const [saveMovie, { error }] = useMutation(SAVE_MOVIE);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    const searchUrl = `https://imdb-api.com/en/API/SearchMovie/k_h0j7l9s3/${searchInput.trim()}`;
    console.log("Searching URL", searchUrl);

    try {
      const response = await fetch(searchUrl);
      if (!response.ok) {
        throw new Error("something went wrong");
      }

      const { results } = await response.json();
      const newResults = results.filter(
        (movie) => movie.image && !movie.image.includes("nopicture")
      );

      console.log(newResults);

      const movieData = await newResults.map((movie) => ({
        movieId: movie.id,
        movieTitle: movie.title,
        movieImage: movie.image,
      }));

      setSearchedMovies(movieData);

      setSearchInput("");
    } catch (err) {
      console.error(err);
    }

    setSearchInput("");
  }

  const handleSaveMovie = async (movieId) => {
    const movieToSave = searchedMovies.find(
      (movie) => movie.movieId === movieId
    );

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

      //console.log("saved movie Ids", savedMovieIds);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="jumbotron mb-4" style={{ backgroundColor: "yellow" }}>
        <div className="container">
          <h2>Search for Movies</h2>
          <div className="flex-row">
            <form onSubmit={handleFormSubmit}>
              <input
                className="form-input py-1"
                style={{ width: "300px" }}
                placeholder="Search for a movie"
                name="searchInput"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button
                className="btn btn-block btn-primary my-4 mx-2"
                style={{ cursor: "pointer" }}
                type="submit"
              >
                Submit Search
              </button>
            </form>
          </div>
        </div>
      </div>

      <main>
        <div className="flex-row">
          <div className="col-sm-12">
            {!searchedMovies ? (
              <p>Searching.....</p>
            ) : (
              <div className="row text-center">
                {searchedMovies.map((movie, index) => (
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
                        <h5
                          className="card-title"
                          style={{ marginBottom: "70px" }}
                        >
                          {movie.movieTitle}
                        </h5>
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
                            style={{
                              width: "100%",
                              position: "absolute",
                              bottom: "1px",
                              left: "1px",
                            }}
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

export default SearchMovies;