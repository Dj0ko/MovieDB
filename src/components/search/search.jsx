import React, { Component } from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';

import './search.css';

export default class Search extends Component {
  state = {
    movieTitle: '',
  };

  onLabelChange = (evt) => {
    const { getKeyword } = this.props;
    getKeyword(evt.target.value);
    this.setState({
      movieTitle: evt.target.value,
    });
  };

  render() {
    const { movieTitle } = this.state;

    return (
      <Input
        type="text"
        placeholder="Type to search..."
        onChange={this.onLabelChange}
        className="search__input"
        value={movieTitle}
      />
    );
  }
}

Search.propTypes = {
  getKeyword: PropTypes.func.isRequired,
};
