import React, { Component } from 'react';
import MovieDbService from '../../services/movies-services';
import Search from '../search/search';
import FilmList from '../film-list/film-list';

import './app.css';

export default class App extends Component {
  movieDbService = new MovieDbService();

  state = {
    movieTitle: '',
  };

  componentDidMount() {
    this.movieDbService.getGuestSession();
  }

  getKeyword = (keyword) => {
    this.setState({
      movieTitle: keyword,
    });
  };

  render() {
    const { movieTitle } = this.state;

    return (
      <>
        <Search getKeyword={this.getKeyword} />
        <FilmList movieTitle={movieTitle} />
      </>
    );
  }
}
