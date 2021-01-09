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

const setQuery = (query) => ({ type: 'search/setQuery', query });
const showResults = (results) => ({ type: 'search/showResults', results });
export const setSelected = (index) => ({ type: 'search/setSelected', index });
export const clearSearch = () => ({ type: 'search/clearSearch' });

export const executeSearch = (query) => {
  return async (dispatch) => {
    if (query) {
      dispatch(setQuery(query));

      try {
        const urlQueryString = querystring.stringify({ q: query });
        const url = `${process.env.REACT_APP_API}/v1/songs/search?${urlQueryString}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.metadata.q === store.getState().search.query) {
          dispatch(showResults(data.songs));

          const [method, body] = ['POST', new FormData()];
          body.append('q', query);
          await fetch(`${process.env.REACT_APP_API}/v1/queries`, { method, body });
        }
      } catch(e) {
        console.error(e);
      }

    } else {
      dispatch(clearSearch());
    }
  };
}
