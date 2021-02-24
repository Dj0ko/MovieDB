import React, { Component } from 'react';
import { List, Card } from 'antd';
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
  };

  componentDidMount() {
    this.updateFilms();
  }

  componentDidUpdate = debounce((prevProps) => {
    const { movieTitle } = this.props;

    if (movieTitle !== prevProps.movieTitle) {
      this.updateFilms();
    }
  }, 1000);

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

    if (!movieTitle) {
      return;
    }

    this.movieDbService
      .getResource(movieTitle)
      .then((films) => {
        this.setState({
          data: films.results,
          loading: false,
        });
      })
      .catch(this.onError);
  }

  render() {
    const { data, loading, error } = this.state;

    if (loading) {
      return <Spinner />;
    }

    if (error) {
      return <ErrorMessage />;
    }

    return (
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
              <p>{format(new Date(item.release_date), 'PP')}</p>
              {this.getShortText(item.overview)}
            </Card>
          </List.Item>
        )}
      />
    );
  }
}

FilmList.propTypes = {
  movieTitle: PropTypes.string.isRequired,
};
