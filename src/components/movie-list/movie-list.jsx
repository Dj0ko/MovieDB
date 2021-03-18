import React, { Component } from 'react';
import { List, Pagination } from 'antd';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import MovieDbService from '../../services/movies-services';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../error-message/error-message';
import MovieCard from '../movie-card/movie-card';

import './movie-list.css';

export default class MovieList extends Component {
  movieDbService = new MovieDbService();

  state = {
    data: [],
    loading: true,
    error: false,
    page: 1,
  };

  /* Обновление компонента */
  componentDidUpdate = debounce((prevProps, prevState) => {
    const { keyword, showRated } = this.props;
    const { page } = this.state;

    if (keyword !== prevProps.keyword) {
      this.onChangePage(1);
      this.updateMovies();
    }

    if (page !== prevState.page) {
      this.updatePages();
    }

    if (showRated !== prevProps.showRated) {
      if (!showRated) {
        this.updateMovies();
      } else {
        this.showRatedMovies();
      }
    }
  }, 1000);

  /* Функция, устанавлиющая значение страницы при её изменении */
  onChangePage = (page) => {
    this.setState({
      page,
    });
  };

  /* Функция, показывающая ошибку */
  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  /* Функция, обновляющая фильмы по новому ключевому слову */
  updateMovies() {
    const { keyword } = this.props;
    const { page } = this.state;

    if (!keyword) {
      return;
    }

    this.movieDbService
      .getResource(keyword, page)
      .then((movies) => {
        this.setState({
          data: movies,
          loading: false,
        });
      })
      .catch(this.onError);
  }

  /* Функция, показывающая оцененные фильмы */
  showRatedMovies() {
    const { guestSessionId } = this.props;

    this.movieDbService.getRatedMovies(guestSessionId).then((movies) => {
      this.setState({
        data: movies,
        loading: false,
      });
    });
  }

  /* Функция, обновляющая фильмы при изменении страницы */
  updatePages() {
    const { keyword } = this.props;
    const { page } = this.state;

    this.movieDbService
      .getResource(keyword, page)
      .then((movies) => {
        this.setState({
          data: movies,
          loading: false,
        });
      })
      .catch(this.onError);
  }

  render() {
    const { data, loading, error, page } = this.state;
    const { guestSessionId, setRating, idsAndRatings } = this.props;

    if (loading) {
      return <Spinner />;
    }

    if (error) {
      return <ErrorMessage />;
    }

    if (data.length === 0) {
      return <p>По данному запросу фильмов не найдено</p>;
    }

    return (
      <>
        <List
          dataSource={data.results}
          renderItem={(item) => (
            <List.Item>
              <MovieCard
                poster={item.poster_path}
                title={item.title}
                dataRelease={item.release_date}
                overview={item.overview}
                id={item.id}
                voteAverage={item.vote_average}
                guestSessionId={guestSessionId}
                setRating={(myRating, id) => setRating(myRating, id)}
                idsAndRatings={idsAndRatings}
                genreIds={item.genre_ids}
              />
            </List.Item>
          )}
        />
        <Pagination
          current={page}
          onChange={this.onChangePage}
          total={data.total_results}
          defaultPageSize="20"
          className="movie-list__pagination"
        />
      </>
    );
  }
}

MovieList.propTypes = {
  keyword: PropTypes.string.isRequired,
  guestSessionId: PropTypes.string.isRequired,
  showRated: PropTypes.bool.isRequired,
  setRating: PropTypes.func.isRequired,
  idsAndRatings: PropTypes.arrayOf(PropTypes.object).isRequired,
};
