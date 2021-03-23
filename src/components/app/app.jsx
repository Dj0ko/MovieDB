import React, { Component } from 'react';
import movieDbService from '../../services/movies-services';
import Search from '../search/search';
import MovieList from '../movie-list/movie-list';
import { GenresProvider } from '../genres-context/genres-context';

import './app.css';

export default class App extends Component {
  state = {
    keyword: '',
    guestSessionId: '',
    idsAndRatings: [],
    showRated: false,
    genres: [],
  };

  componentDidMount() {
    this.getSessionId();
    this.getGenres();
  }

  onToggleRated = () => {
    const buttonSearch = document.querySelector('.button--search');
    const buttonRated = document.querySelector('.button--rated');
    buttonRated.classList.add('button--active');
    buttonSearch.classList.remove('button--active');

    this.setState({
      showRated: true,
    });
  };

  onToggleSearch = () => {
    const buttonSearch = document.querySelector('.button--search');
    const buttonRated = document.querySelector('.button--rated');
    buttonSearch.classList.add('button--active');
    buttonRated.classList.remove('button--active');

    this.setState({
      showRated: false,
    });
  };

  getKeyword = (keyword) => {
    this.setState({
      keyword,
    });
  };

  getSessionId() {
    movieDbService.getGuestSession().then((body) => {
      this.setState({
        guestSessionId: body.guest_session_id,
      });
    });
  }

  getGenres() {
    movieDbService.getGenres().then((body) => {
      this.setState({
        genres: body,
      });
    });
  }

  setRating = (myRating, id) => {
    this.setState(({ idsAndRatings }) => {
      const newIdsAndRatings = [
        ...idsAndRatings,
        {
          id,
          myRating,
        },
      ];

      return {
        idsAndRatings: newIdsAndRatings,
      };
    });
  };

  render() {
    const { keyword, guestSessionId, idsAndRatings, showRated, genres } = this.state;

    return (
      <>
        <div className="container container__button">
          <button type="button" className="button button--search button--active" onClick={this.onToggleSearch}>
            Search
          </button>
          <button type="button" className="button button--rated" onClick={this.onToggleRated}>
            Rated
          </button>
        </div>
        {!showRated ? <Search getKeyword={this.getKeyword} /> : null}
        <GenresProvider value={genres}>
          <MovieList
            keyword={keyword}
            guestSessionId={guestSessionId}
            setRating={this.setRating}
            idsAndRatings={idsAndRatings}
            showRated={showRated}
          />
        </GenresProvider>
      </>
    );
  }
}
