import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_MOVIE = gql`
  mutation saveMovie(
    $movieId: ID!
    $movieTitle: String!
    $movieImage: String!
  ) {
    saveMovie(
      movieId: $movieId
      movieTitle: $movieTitle
      movieImage: $movieImage
    ) {
      _id
      username
      email
      favoriteMovies {
        movieId
        movieTitle
        movieImage
      }
    }
  }
`;

export const REMOVE_MOVIE = gql`
  mutation removeMovie($movieId: ID!){
    removeMovie(movieId: $movieId) {
      _id
      username
      email
      favoriteMovies {
        movieId
        movieTitle
        movieImage
      }
    }
  }
`;
