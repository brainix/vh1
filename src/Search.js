/*---------------------------------------------------------------------------*\
 |  Search.js                                                                |
 |                                                                           |
 |  Copyright © 2017-2018, Rajiv Bakulesh Shah, original author.             |
 |                                                                           |
 |      This program is free software: you can redistribute it and/or modify |
 |      it under the terms of the GNU General Public License as published by |
 |      the Free Software Foundation, either version 3 of the License, or    |
 |      (at your option) any later version.                                  |
 |                                                                           |
 |      This program is distributed in the hope that it will be useful, but  |
 |      WITHOUT ANY WARRANTY; without even the implied warranty of           |
 |      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU    |
 |      General Public License for more details.                             |
 |                                                                           |
 |      You should have received a copy of the GNU General Public License    |
 |      along with this program.  If not, see:                               |
 |          <http://www.gnu.org/licenses/>                                   |
\*---------------------------------------------------------------------------*/

import './requestAnimationFrame';
import React from 'react';
import './Search.css';
import './monkey';

const querystring = require('querystring');

class Search extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.updateState = this.updateState.bind(this);
    this.state = {
      query: this.props.query || '',
      results: this.props.results || [],
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      query: nextProps.query || '',
      results: nextProps.results || [],
    });
  }

  onSubmit(eventObject) {
    eventObject.preventDefault();
    this.refs.results.redirect();
  }

  updateState(nextState) {
    this.setState(nextState);
  }

  render() {
    return (
      <form className="Search" onSubmit={this.onSubmit}>
        <Precache />
        <fieldset>
          <Input query={this.state.query} updateState={this.updateState} />
        </fieldset>
        <Results
          results={this.state.results}
          history={this.props.history}
          ref="results"
        />
      </form>
    );
  }
}

class Precache extends React.PureComponent {
  componentDidMount() {
    this.getQueries();
  }

  getQueries() {
    fetch(`${process.env.REACT_APP_API}/queries`)
      .then(response => response.json())
      .then(data => this.cacheQueries(data.queries))
      .catch(console.log);
  }

  cacheQueries(queries) {
    if (queries.length) {
      const query = queries.shift();
      const urlQueryString = querystring.stringify({ q: query });
      fetch(`${process.env.REACT_APP_API}/songs/search?${urlQueryString}`)
        .then(() => this.cacheQueries(queries))
        .catch(error => {
          console.log(error);
          this.cacheQueries(queries);
        });
    }
  }

  render() {
    return null;
  }
}

class Input extends React.PureComponent {
  constructor(props) {
    super(props);
    this.GTFO_KEYS = [27];
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.input = null;
    this.video = null;
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keypress', this.onKeyPress);
    this.input = document.querySelectorAll('input[type=search]')[0];
  }

  componentDidUpdate() {
    if (!this.props.query) {
      this.input.blur();
    }
  }

  onKeyDown(eventObject) {
    if (
      document.activeElement !== this.input
      && this.GTFO_KEYS.includes(eventObject.which)
    ) {
      window.location.href = '/gtfo';
    }
  }

  onKeyPress(eventObject) {
    const c = String.fromCharCode(eventObject.which);
    if (c && /^[0-9a-z]+$/i.test(c) && document.activeElement !== this.input) {
      this.input.focus();
    }
  }

  onFocus() {
    const video = document.getElementsByClassName('Playing')[0];
    if (video) {
      this.video = video;
      this.video.classList.remove('Playing');
    }
  }

  onBlur() {
    if (this.video) {
      this.video.classList.add('Playing');
    };
  }

  onChange(eventObject) {
    const query = eventObject.target.value;
    this.props.updateState({ query });
    if (query) {
      const urlQueryString = querystring.stringify({ q: query });
      fetch(`${process.env.REACT_APP_API}/songs/search?${urlQueryString}`)
        .then(response => response.json())
        .then(data => this.props.updateState({ results: data.songs }))
        .catch(console.log);
      const [method, body] = ['POST', new FormData()];
      body.append('q', query);
      fetch(`${process.env.REACT_APP_API}/queries`, { method, body })
        .catch(console.log);
    } else {
      this.props.updateState({ results: [] });
    }
  }

  render() {
    return (
      <input
        type="search"
        placeholder="Search"
        maxLength="20"
        autoComplete="off"
        spellCheck="false"
        value={this.props.query}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onChange={this.onChange}
      />
    );
  }
}

class Results extends React.PureComponent {
  constructor(props) {
    super(props);
    this.UP_KEYS = [38];
    this.DOWN_KEYS = [40];
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.updateSelected = this.updateSelected.bind(this);
    this.state = { selected: null };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
  }

  componentWillReceiveProps() {
    this.setState({ selected: null });
  }

  onKeyDown(eventObject) {
    if (
      this.props.results.length
      && this.UP_KEYS.concat(this.DOWN_KEYS).includes(eventObject.which)
    ) {
      eventObject.preventDefault();
    }
  }

  onKeyUp(eventObject) {
    if (this.props.results.length) {
      if (this.UP_KEYS.includes(eventObject.which)) {
        this.updateSelected(-1);
      } else if (this.DOWN_KEYS.includes(eventObject.which)) {
        this.updateSelected(1);
      }
    }
  }

  updateSelected(direction) {
    let selected = this.state.selected;
    if (selected === null) {
      selected = -0.5 * direction - 0.5;
    }
    selected += direction;
    selected += this.props.results.length;
    selected %= this.props.results.length;
    this.setState({ selected: selected });
  }

  redirect() {
    if (this.refs.result) {
      this.props.history.push(this.refs.result.target);
    }
  }

  render() {
    const items = [];
    this.props.results.forEach((result, index) => {
      const key = result._id;
      const selected = index === this.state.selected;
      const ref = index === this.state.selected ? 'result' : null;
      const item = (
        <Result key={key} result={result} selected={selected} ref={ref} />
      );
      items.push(item);
    });
    return <ol>{items}</ol>;
  }
}

class Result extends React.PureComponent {
  constructor(props) {
    super(props);
    const { artist__id, song__id } = this.props.result;
    this.target = `/${artist__id}/${song__id}`;
  }

  componentWillReceiveProps(nextProps) {
    const { artist__id, song__id } = nextProps.result;
    this.target = `/${artist__id}/${song__id}`;
  }

  render() {
    const style = { textDecoration: this.props.selected ? 'underline' : null };
    const { artist, song } = this.props.result;
    const html = `${artist} &mdash; ${song}`;
    const title = html.htmlToText();
    return (
      <li>
        <a
          href={this.target}
          style={style}
          dangerouslySetInnerHTML={{ __html: html }}
          title={title}
        />
      </li>
    );
  }
}

export default Search;
