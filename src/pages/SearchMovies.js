import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";

import { SAVE_MOVIE } from "../utils/mutations";
import { QUERY_USER } from "../utils/queries";

import Auth from "../utils/auth";

const SearchMovies = () => {
  // get user data
  const { loading, data } = useQuery(QUERY_USER);

  const userData = data?.me || {};

  // create state for holding returned movies from api
  const [searchedMovies, setSearchedMovies] = useState([]);

  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");

  const [saveMovie, { error }] = useMutation(SAVE_MOVIE);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }


    const searchUrl = `https://imdb-api.com/en/API/SearchMovie/k_1o5t5erq/${searchInput.trim()}`;
    
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
  };

  const handleSaveMovie = async (movieId) => {
    const movieToSave = searchedMovies.find(
      (movie) => movie.movieId === movieId
    );

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
    return <div>Loading...</div>;
  }

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
                        {Auth.loggedIn() ? (
                          <h5
                            className="card-title"
                            style={{ marginBottom: "65px" }}
                          >
                            {movie.movieTitle}
                          </h5>
                        ) : (
                          <h5 className="card-title">{movie.movieTitle}</h5>
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

export default SearchMovies;