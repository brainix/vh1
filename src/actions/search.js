/*---------------------------------------------------------------------------*\
 |  search.js                                                                |
 |                                                                           |
 |  Copyright © 2017-2021, Rajiv Bakulesh Shah, original author.             |
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

import store from '../store';

const querystring = require('querystring');

export const SET_QUERY = 'SET_QUERY';
export const SHOW_RESULTS = 'SHOW_RESULTS';
export const SET_SELECTED = 'SET_SELECTED';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';

const setQuery = (query) => ({ type: SET_QUERY, query });
const showResults = (results) => ({ type: SHOW_RESULTS, results });
export const setSelected = (index) => ({ type: SET_SELECTED, index });
export const clearSearch = () => ({ type: CLEAR_SEARCH });

export const executeSearch = (query) => {
  return (dispatch) => {
    if (query) {
      dispatch(setQuery(query));

      const urlQueryString = querystring.stringify({ q: query });
      fetch(`${process.env.REACT_APP_API}/v1/songs/search?${urlQueryString}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.metadata.q === store.getState().search.query) {
            dispatch(showResults(data.songs));

            const [method, body] = ['POST', new FormData()];
            body.append('q', query);
            fetch(`${process.env.REACT_APP_API}/v1/queries`, { method, body })
              .catch(console.error);
          }
        })
        .catch(console.error);
      } else {
        dispatch(clearSearch());
      }
  };
}
