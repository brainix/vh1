/*---------------------------------------------------------------------------*\
 |  Search.js                                                                |
 |                                                                           |
 |  Copyright © 2017-2020, Rajiv Bakulesh Shah, original author.             |
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

import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import '../requestAnimationFrame';
import '../monkey';
import { executeSearch, setSelected, clearSearch } from '../actions/search';
import './Search.css';

class Search extends React.PureComponent {
  componentDidMount() {
    this.props.clearSearch();
  }

  onSubmit = (eventObject) => {
    eventObject.preventDefault();
    if (this.props.search.results && this.props.search.selected !== null) {
      const { artist__id, song__id } = this.props.search.results[this.props.search.selected];
      const target = `/${artist__id}/${song__id}`;
      this.props.history.push(target);
      this.props.clearSearch();
    }
  }

  render() {
    return (
      <form className="Search" onSubmit={this.onSubmit}>
        <fieldset>
          <ConnectedInput />
        </fieldset>
        <ConnectedResults history={this.props.history} />
      </form>
    );
  }
}

let mapStateToProps = (state) => ({
  search: state.search,
});

let mapDispatchToProps = (dispatch) => ({
  clearSearch: () => dispatch(clearSearch()),
});

const ConnectedSearch = connect(mapStateToProps, mapDispatchToProps)(Search);

class Input extends React.PureComponent {
  constructor(props) {
    super(props);
    this.GTFO_KEYS = [27];
    this.input = null;
    this.video = null;
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keypress', this.onKeyPress);
    this.input = document.querySelectorAll('input[type=search]')[0];
  }

  componentDidUpdate() {
    if (!this.props.search.query) {
      this.input.blur();
    }
  }

  onKeyDown = (eventObject) => {
    if (
      document.activeElement !== this.input
      && this.GTFO_KEYS.includes(eventObject.which)
    ) {
      window.location.href = '/gtfo';
    }
  }

  onKeyPress = (eventObject) => {
    const c = String.fromCharCode(eventObject.which);
    if (c && /^[0-9a-z]+$/i.test(c) && document.activeElement !== this.input) {
      this.input.focus();
    }
  }

  onFocus = () => {
    const video = document.getElementsByClassName('Playing')[0];
    if (video) {
      this.video = video;
      this.video.classList.remove('Playing');
    }
  }

  onBlur = () => {
    if (this.video) {
      this.video.classList.add('Playing');
    };
  }

  onChange = (eventObject) => {
    const query = eventObject.target.value;
    this.props.executeSearch(query);
    const [method, body] = ['POST', new FormData()];
    body.append('q', query);
    fetch(`${process.env.REACT_APP_API}/v1/queries`, { method, body })
      .catch(console.log);
  }

  render() {
    return (
      <input
        type="search"
        placeholder="Search"
        maxLength="20"
        autoComplete="off"
        spellCheck="false"
        value={this.props.search.query}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onChange={this.onChange}
      />
    );
  }
}

mapStateToProps = (state) => ({
  search: state.search,
});

mapDispatchToProps = (dispatch) => ({
  executeSearch: (query) => dispatch(executeSearch(query)),
});

const ConnectedInput = connect(mapStateToProps, mapDispatchToProps)(Input);

class Results extends React.PureComponent {
  constructor(props) {
    super(props);
    this.UP_KEYS = [38];
    this.DOWN_KEYS = [40];
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
      document.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = (eventObject) => {
    if (this.props.search.results.length) {
      if (this.UP_KEYS.includes(eventObject.which)) {
        eventObject.preventDefault();
        this.updateSelected(-1);
      } else if (this.DOWN_KEYS.includes(eventObject.which)) {
        eventObject.preventDefault();
        this.updateSelected(1);
      }
    }
  }

  updateSelected = (direction) => {
    let selected = this.props.search.selected;
    if (selected === null) {
      selected = -0.5 * direction - 0.5;
    }
    selected += direction;
    selected += this.props.search.results.length;
    selected %= this.props.search.results.length;
    this.props.setSelected(selected);
  }

  render() {
    const items = [];
    this.props.search.results.forEach((result, index) => {
      const item = (
        <ConnectedResult
          key={result._id}
          result={result}
          index={index}
        />
      );
      items.push(item);
    });
    return <ol>{items}</ol>;
  }
}

mapStateToProps = (state) => ({
  search: state.search,
});

mapDispatchToProps = (dispatch) => ({
  setSelected: (index) => dispatch(setSelected(index)),
});

const ConnectedResults = connect(mapStateToProps, mapDispatchToProps)(Results);

class Result extends React.PureComponent {
  onMouseEnter = (eventObject) => {
    this.props.setSelected(this.props.index);
  }

  onClick = () => {
    this.props.clearSearch();
  }

  render() {
    const { artist__id, song__id, artist, song } = this.props.result;
    const target = `/${artist__id}/${song__id}`;
    const selected = this.props.index === this.props.search.selected;
    const style = { textDecoration: selected ? 'underline' : null };
    const html = `${artist} &mdash; ${song}`;
    const title = html.htmlToText();
    return (
      <li>
        <Link
          to={target}
          style={style}
          dangerouslySetInnerHTML={{ __html: html }}
          title={title}
          onMouseEnter={this.onMouseEnter}
          onClick={this.onClick}
        />
      </li>
    );
  }
}

mapStateToProps = (state) => ({
  search: state.search,
});

mapDispatchToProps = (dispatch) => ({
  setSelected: (index) => dispatch(setSelected(index)),
  clearSearch: () => dispatch(clearSearch()),
});

const ConnectedResult = connect(mapStateToProps, mapDispatchToProps)(Result);

export default ConnectedSearch;
