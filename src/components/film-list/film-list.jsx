import React, { Component } from 'react';
import { List, Card } from 'antd';
import { format } from 'date-fns';
import MovieDbService from '../../services/movies-services';

import './film-list.css';

export default class FilmList extends Component {
  movieDbService = new MovieDbService();

  state = {
    data: [],
  };

  constructor() {
    super();
    this.getFilms();
  }

  getFilms() {
    this.movieDbService.getResource('return').then((films) => {
      // console.log(films.results);
      // console.log(films);
      this.setState({
        data: films.results,
      });
    });
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
    const { data } = this.state;

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
