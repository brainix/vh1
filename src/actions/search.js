/*---------------------------------------------------------------------------*\
 |  search.js                                                                |
 |                                                                           |
 |  Copyright © 2017-2019, Rajiv Bakulesh Shah, original author.             |
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

export const SET_QUERY = 'SET_QUERY';
export const SHOW_RESULTS = 'SHOW_RESULTS';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';

const setQuery = (query) => {
  return {
    type: SET_QUERY,
    query,
  };
}

const showResults = (results) => {
  return {
    type: SHOW_RESULTS,
    results,
  };
}

export const executeSearch = (query) => {
  return (dispatch) => {
    dispatch(setQuery(query));
    fetch(`${process.env.REACT_APP_API}/v1/songs/search?${query}`)
      .then((response) => response.json())
      .then((data) => dispatch(showResults(data.songs)))
      .catch(console.log);
  };
}

export const clearSearch = () => {
  return {
    type: CLEAR_SEARCH,
  };
}
