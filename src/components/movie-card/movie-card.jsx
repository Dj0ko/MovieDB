import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Rate } from 'antd';
import { format } from 'date-fns';
import movieDbService from '../../services/movies-services';
import { GenresConsumer } from '../genres-context/genres-context';

import './movie-card.css';

export default class MovieCard extends Component {
  maxId = 0;

  state = {
    value: 0,
  };

  componentDidMount() {
    console.log('componentDidMount');
    this.setStars();
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    this.resetStars();
  }

  getShortText() {
    const { title } = this.props;
    let { overview } = this.props;

    if (overview.length <= 80) {
      return overview;
    }

    if (title.length < 28) {
      overview = overview.slice(0, 130);
      overview = `${overview.slice(0, overview.lastIndexOf(' '))}...`;
    }

    if (title.length >= 28 && title.length < 60) {
      overview = overview.slice(0, 85);
      overview = `${overview.slice(0, overview.lastIndexOf(' '))}...`;
    }

    if (title.length >= 60) {
      overview = overview.slice(0, 60);
      overview = `${overview.slice(0, overview.lastIndexOf(' '))}...`;
    }

    return overview;
  }

  setStars = () => {
    const { id, idsAndRatings } = this.props;

    idsAndRatings.forEach((el) => {
      if (el.id === id) {
        this.setState({
          value: el.myRating,
        });
      }
    });
  };

  resetStars = () => {
    this.setState({
      value: 0,
    });
  };

  handleChange = (value, id) => {
    const { guestSessionId, setRating } = this.props;
    movieDbService.rateMovie(value, id, guestSessionId);
    this.setState({ value });
    setRating(value, id);
  };

  setColor = () => {
    const { voteAverage } = this.props;

    if (voteAverage < 3) {
      return 'movie-card__vote-average movie-card__vote-average--red';
    }

    if (voteAverage >= 3 && voteAverage < 5) {
      return 'movie-card__vote-average movie-card__vote-average--orange';
    }

    if (voteAverage >= 5 && voteAverage < 7) {
      return 'movie-card__vote-average movie-card__vote-average--yellow';
    }

    if (voteAverage >= 7) {
      return 'movie-card__vote-average movie-card__vote-average--green';
    }
    return voteAverage;
  };

  render() {
    const { poster, title, dataRelease, id, voteAverage } = this.props;

    const { value } = this.state;

    return (
      <>
        <img src={`https://image.tmdb.org/t/p/w300${poster}`} className="ant-image" alt="Movies poster" />
        <Card className="movie-card" title={title}>
          <span className={this.setColor()}>{voteAverage}</span>
          <p className="movie-card__data-release">{dataRelease ? format(new Date(dataRelease), 'PP') : null}</p>
          <GenresConsumer>
            {({ genres }) => {
              if (!genres) {
                return <ul className="movie-card__genres" />;
              }

              const { genreIds } = this.props;
              let arr = [];

              genreIds.forEach((genreId) =>
                genres.forEach((genre) => {
                  if (genre.id === genreId) {
                    arr = [...arr, genre.name];
                  }
                })
              );

              const genreNames = arr.map((name) => {
                this.maxId += 1;
                return (
                  <li className="movie-card__genres-item" key={this.maxId}>
                    {name}
                  </li>
                );
              });

              return <ul className="movie-card__genres">{genreNames}</ul>;
            }}
          </GenresConsumer>
          <p className="movie-card__text">{this.getShortText()}</p>
          <Rate allowHalf count="10" onChange={(rateValue) => this.handleChange(rateValue, id)} value={value} />
        </Card>
      </>
    );
  }
}

MovieCard.propTypes = {
  poster: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  dataRelease: PropTypes.string.isRequired,
  overview: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  voteAverage: PropTypes.number.isRequired,
  setRating: PropTypes.func.isRequired,
  guestSessionId: PropTypes.string.isRequired,
  idsAndRatings: PropTypes.arrayOf(PropTypes.object).isRequired,
  genreIds: PropTypes.arrayOf(PropTypes.number).isRequired,
};
