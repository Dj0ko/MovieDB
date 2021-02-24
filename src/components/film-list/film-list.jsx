import React, { Component } from 'react';
import { List, Card, Pagination } from 'antd';
import { format } from 'date-fns';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import MovieDbService from '../../services/movies-services';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../error-message/error-message';

import './film-list.css';

export default class FilmList extends Component {
  movieDbService = new MovieDbService();

  state = {
    data: [],
    loading: true,
    error: false,
    page: 1,
  };

  componentDidMount() {
    this.updateFilms();
  }

  componentDidUpdate = debounce((prevProps, prevState) => {
    const { movieTitle } = this.props;
    const { page } = this.state;

    if (movieTitle !== prevProps.movieTitle || page !== prevState.page) {
      this.updateFilms();
    }
  }, 1000);

  onChange = (page) => {
    this.setState({
      page,
    });
    this.componentDidUpdate();
  };

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  getShortText(text) {
    let shortenText = text;

    if (shortenText.length > 200) {
      shortenText = text.slice(0, 200);
      shortenText = `${shortenText.slice(0, shortenText.lastIndexOf(' '))} ...`;
    }

    return shortenText;
  }

  updateFilms() {
    const { movieTitle } = this.props;
    const { page } = this.state;

    if (!movieTitle) {
      return;
    }

    this.movieDbService
      .getResource(movieTitle, page)
      .then((films) => {
        this.setState({
          data: films.results,
          loading: false,
        });
      })
      .catch(this.onError);
  }

  render() {
    const { data, loading, error, page } = this.state;

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
          grid={{ gutter: 36, column: 2 }}
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <img
                src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                className="ant-image"
                alt="Films poster"
                width="183px"
                height="281px"
              />
              <Card title={item.title}>
                <p>{item.release_date ? format(new Date(item.release_date), 'PP') : null}</p>
                {this.getShortText(item.overview)}
              </Card>
            </List.Item>
          )}
        />
        <Pagination page={page} onChange={this.onChange} total={50} className="film-list__pagination" />
      </>
    );
  }
}

FilmList.propTypes = {
  movieTitle: PropTypes.string.isRequired,
};
