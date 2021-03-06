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

const searchReducer = (state = { query: '', results: [], selected: null }, action) => {
  switch (action.type) {
    case 'search/setQuery':
      return { ...state, query: action.query, selected: null };
    case 'search/showResults':
      return { ...state, results: action.results, selected: null };
    case 'search/setSelected':
      return { ...state, selected: action.index };
    case 'search/clearSearch':
      return { query: '', results: [], selected: null };
    default:
      return state;
  }
};

export default searchReducer;
