import React from "react";
import {
    Jumbotron,
    Container,
    CardColumns,
    Card,
    Button,
  } from 'react-bootstrap';

import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';
import { REMOVE_MOVIE } from '../utils/mutations';
import { Link } from 'react-router-dom';

import Auth from '../utils/auth';
//import { async } from "q";
import { removeMovieId } from "../utils/localStorage";

const Profile = () => {
    const { loading, data } = useQuery(QUERY_USER);
    const [removeMovie, { error } ] = useMutation(REMOVE_MOVIE);

    const userData = data?.me || {};

    const handleDeleteMovie = async (movieId) => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
            return false;
          }
      
          try {
            const { data } = await removeMovie({
              variables: { movieId },
            });
      
            // upon success, remove book's id from localStorage
            //removeMovieId(movieId);
          } catch (err) {
            console.error(err);
          }
    };

    if (loading) {
        return <h2>LOADING...</h2>;
      }

      return (
        <>
        <div className="row justify-content-right">
          <div className="col-sm text-center">
            <Link className="btn btn-lg btn-info mb-0" to="/searchmovies">
              Search for Movies
            </Link>
          </div>
        </div>
        <Jumbotron fluid className="text-light bg-dark">
            <Container>
                <h1>Viewing {userData.username}'s favorite movies!</h1>
            </Container>
        </Jumbotron>
        <Container>
            <h2>
            {userData.favoriteMovies?.length
            ? `Viewing ${userData.favoriteMovies.length} saved ${
                userData.favoriteMovies.length === 1 ? 'movie' : 'movies'
              }:`
            : 'You have no saved movies!'}
            </h2>
            <CardColumns className="row row-cols-3 g-3">
            {userData.favoriteMovies?.map((movie) => {
            return (
              <Card key={movie.movieId} border="dark">
                {movie.movieImage ? (
                  <Card.Img
                    src={movie.movieImage}
                    alt={`The poster for ${movie.movieTitle}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{movie.movieTitle}</Card.Title>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteMovie(movie.movieId).then(removeMovieId(movie.movieId))}
                  >
                    Unfavorite Movie!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
            </CardColumns>
        </Container>
        </>
      )

}

export default Profile;
