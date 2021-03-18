import React, { Component } from 'react';
import MovieDbService from '../../services/movies-services';
import Search from '../search/search';
import MovieList from '../movie-list/movie-list';
import { GenresProvider } from '../genres-context/genres-context';

import './app.css';

export default class App extends Component {
  movieDbService = new MovieDbService();

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
    this.setState({
      showRated: true,
    });
  };

  onToggleSearch = () => {
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
    this.movieDbService.getGuestSession().then((body) => {
      this.setState({
        guestSessionId: body.guest_session_id,
      });
    });
  }

  getGenres() {
    this.movieDbService.getGenres().then((body) => {
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

    const buttonSearchStyle = {
      borderBottom: '',
      color: '',
    };

    const buttonRatedStyle = {
      borderBottom: '',
      color: '',
    };

    if (!showRated) {
      buttonSearchStyle.borderBottom = '2px solid #1890FF';
      buttonSearchStyle.color = '#1890FF';
      buttonRatedStyle.borderBottom = '';
      buttonRatedStyle.color = '';
    } else {
      buttonSearchStyle.borderBottom = '';
      buttonSearchStyle.color = '';
      buttonRatedStyle.borderBottom = '2px solid #1890FF';
      buttonRatedStyle.color = '#1890FF';
    }

    return (
      <GenresProvider value={genres}>
        <div className="container container__button">
          <button
            type="button"
            className="button button--search"
            style={buttonSearchStyle}
            onClick={this.onToggleSearch}
          >
            Search
          </button>
          <button type="button" className="button button--rated" style={buttonRatedStyle} onClick={this.onToggleRated}>
            Rated
          </button>
        </div>
        {!showRated ? <Search getKeyword={this.getKeyword} /> : null}
        <MovieList
          keyword={keyword}
          guestSessionId={guestSessionId}
          setRating={this.setRating}
          idsAndRatings={idsAndRatings}
          showRated={showRated}
        />
      </GenresProvider>
    );
  }
}
