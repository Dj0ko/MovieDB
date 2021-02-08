import React, { Component } from 'react';
import { List, Card } from 'antd';
import { format } from 'date-fns';
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

  constructor() {
    super();
    this.getFilms();
  }

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  getFilms() {
    this.movieDbService
      .getResource('return')
      .then((films) => {
        this.setState({
          data: films.results,
          loading: false,
        });
      })
      .catch(this.onError);
  }

  shortenText(text) {
    let as = text;
    if (as.length > 200) {
      as = text.slice(0, 200);
      as = `${as.slice(0, as.lastIndexOf(' '))} ...`;
    }
    return as;
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
              {this.shortenText(item.overview)}
            </Card>
          </List.Item>
        )}
      />
    );
  }
}
