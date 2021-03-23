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

  componentDidUpdate(prevProps) {
    const { id } = this.props;

    if (id !== prevProps.id) {
      this.resetStars();
      this.setStars();
    }
  }

  getShortText(text, leng) {
    let shortenText = text;

    if (shortenText.length > leng) {
      shortenText = text.slice(0, leng);
      shortenText = `${shortenText.slice(0, shortenText.lastIndexOf(' '))} ...`;
    }

    return shortenText;
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

  resetStars = () => {
    this.setState({
      value: 0,
    });
  };

  render() {
    const { poster, title, dataRelease, overview, id, voteAverage } = this.props;

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
          <p className="movie-card__text">{this.getShortText(overview, 60)}</p>
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
