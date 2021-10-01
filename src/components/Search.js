/*---------------------------------------------------------------------------*\
 |  Search.js                                                                |
\*---------------------------------------------------------------------------*/

import React, { useEffect, useCallback, createRef, useRef } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import '../requestAnimationFrame';
import '../monkey';
import { executeSearch, setSelected, clearSearch } from '../actions/search';
import './Search.css';
import { iOS } from '../utils';

const Search = React.memo(function Search(props) {
  useEffect(() => {
    props.clearSearch();
    // eslint-disable-next-line
  }, []);

  const { results, selected } = props.search;
  const navigateToSelectedResult = useCallback((eventObject) => {
    eventObject.preventDefault();
    if (results && selected !== null) {
      const { artist__id, song__id } = results[selected];
      const target = `/${artist__id}/${song__id}`;
      props.history.push(target);
      props.clearSearch();
    }
  }, [results, selected]);

  return (
    <form className="Search" onSubmit={navigateToSelectedResult}>
      <fieldset>
        <ConnectedInput />
      </fieldset>
      <ConnectedResults />
    </form>
  );
});

let mapStateToProps = (state) => ({
  search: state.search,
});

let mapDispatchToProps = (dispatch) => ({
  clearSearch: () => dispatch(clearSearch()),
});

const ConnectedSearch = connect(mapStateToProps, mapDispatchToProps)(Search);

const Input = React.memo(function Input(props) {
  useEffect(() => {
    document.addEventListener('keypress', focusSearch);
    return () => {
      document.removeEventListener('keypress', focusSearch);
    };
  }, []);

  const inputRef = createRef();
  const prevInputRef = useRef();
  useEffect(() => {
    prevInputRef.current = inputRef.current;
    // eslint-disable-next-line
  }, []);

  const { query } = props.search;
  useEffect(() => {
    if (!query) {
      prevInputRef.current.blur();
    }
  }, [query]);

  function focusSearch(eventObject) {
    const c = String.fromCharCode(eventObject.which);
    if (
      document.activeElement !== prevInputRef.current
      && c && /^[0-9a-z]+$/i.test(c)
    ) {
      prevInputRef.current.focus();
    }
  }

  const dimVideo = useCallback((eventObject) => {
    const playing = document.querySelectorAll('.Playing');
    playing.forEach((element) => {
      element.classList.add('NotPlaying');
    });
  }, []);

  const brightenVideo = useCallback((eventObject) => {
    const notPlaying = document.querySelectorAll('.NotPlaying');
    notPlaying.forEach((element) => {
      element.classList.remove('NotPlaying');
    });

    // If the user is on an iPhone, issues a search, then taps "Done" on the
    // keyboard, we need the following line to clear the search query and
    // results.  We need to use setTimeout() with a delay of 0 ms in order to
    // clear search during the next event cycle; without this, taps on search
    // results don't register.
    //
    // Sources:
    //    1. https://medium.com/@jessebeach/dealing-with-focus-and-blur-in-a-composite-widget-in-react-90d3c3b49a9b
    //    2. https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
    if (iOS()) {
      setTimeout(props.clearSearch, 0);
    }
  }, []);

  const executeSearch = useCallback((eventObject) => {
    const query = eventObject.target.value;
    props.executeSearch(query);
  }, []);

  return (
    <input
      type="search"
      ref={inputRef}
      placeholder="Search"
      maxLength="20"
      autoComplete="off"
      spellCheck="false"
      value={props.search.query}
      onFocus={dimVideo}
      onBlur={brightenVideo}
      onChange={executeSearch}
    />
  );
});

mapStateToProps = (state) => ({
  search: state.search,
});

mapDispatchToProps = (dispatch) => ({
  executeSearch: (query) => dispatch(executeSearch(query)),
  clearSearch: () => dispatch(clearSearch()),
});

const ConnectedInput = connect(mapStateToProps, mapDispatchToProps)(Input);

const Results = React.memo(function Results(props) {
  const { results, selected } = props.search;
  useEffect(() => {
    document.addEventListener('keydown', scrollThroughResults);
    return () => {
      document.removeEventListener('keydown', scrollThroughResults);
    };
    // eslint-disable-next-line
  }, [results, selected]);

  function scrollThroughResults(eventObject) {
    const UP_KEYS = [38];
    const DOWN_KEYS = [40];
    if (results.length) {
      if (UP_KEYS.includes(eventObject.which)) {
        eventObject.preventDefault();
        updateSelected(-1);
      } else if (DOWN_KEYS.includes(eventObject.which)) {
        eventObject.preventDefault();
        updateSelected(1);
      }
    }
  }

  function updateSelected(direction) {
    let newSelected = selected;
    if (newSelected === null) {
      newSelected = -0.5 * direction - 0.5;
    }
    newSelected += direction;
    newSelected += results.length;
    newSelected %= results.length;
    props.setSelected(newSelected);
  }

  const items = [];
  results.forEach((result, index) => {
    const item = (
      <ConnectedResult key={result._id} result={result} index={index} />
    );
    items.push(item);
  });
  return <ol>{items}</ol>;
});

mapStateToProps = (state) => ({
  search: state.search,
});

mapDispatchToProps = (dispatch) => ({
  setSelected: (index) => dispatch(setSelected(index)),
});

const ConnectedResults = connect(mapStateToProps, mapDispatchToProps)(Results);

const Result = React.memo(function Result(props) {
  const selectResult = useCallback(() => {
    props.setSelected(props.index);
  }, []);

  const { artist__id, song__id, artist, song } = props.result;
  const target = `/${artist__id}/${song__id}`;
  const selected = props.index === props.search.selected;
  const style = { textDecoration: selected ? 'underline' : null };
  const html = `${artist.textToHtml()} &mdash; ${song.textToHtml()}`;
  const title = `${artist.htmlToText()} - ${song.htmlToText()}`;

  return (
    <li>
      <Link
        to={target}
        style={style}
        dangerouslySetInnerHTML={{ __html: html }}
        title={title}
        onMouseEnter={selectResult}
        onClick={props.clearSearch}
      />
    </li>
  );
});

mapStateToProps = (state) => ({
  search: state.search,
});

mapDispatchToProps = (dispatch) => ({
  setSelected: (index) => dispatch(setSelected(index)),
  clearSearch: () => dispatch(clearSearch()),
});

const ConnectedResult = connect(mapStateToProps, mapDispatchToProps)(Result);

export default ConnectedSearch;
