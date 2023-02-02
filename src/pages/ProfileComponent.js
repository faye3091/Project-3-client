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

import Auth from '../utils/auth';
//import { async } from "q";
import { removeMovieId } from "../utils/localStorage";

const Profile = () => {
    const { loading, data } = useQuery(QUERY_USER);
    const [removeMovie] = useMutation(REMOVE_MOVIE);

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
            removeMovieId(movieId);
          } catch (err) {
            console.error(err);
          }
    };

    if (loading) {
        return <h2>LOADING...</h2>;
      }

      return (
        <>
        <Jumbotron fluid className="text-light bg-dark">
            <Container>
                <h1>Viewing {userData.username}'s favorite movies!</h1>
            </Container>
        </Jumbotron>
        <Container>
            <h2>
            {userData.savedMovies?.length
            ? `Viewing ${userData.savedMovies.length} saved ${
                userData.savedMovies.length === 1 ? 'movie' : 'movies'
              }:`
            : 'You have no saved movies!'}
            </h2>
            <CardColumns>
            {userData.savedMovies?.map((movie) => {
            return (
              <Card key={movie.movieId} border="dark">
                {movie.image ? (
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
                    onClick={() => handleDeleteMovie(movie.movieId)}
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