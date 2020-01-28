/*---------------------------------------------------------------------------*\
 |  Precache.js                                                              |
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

const querystring = require('querystring');

class Precache extends React.PureComponent {
  componentDidMount() {
    this.getQueries();
  }

  getQueries() {
    fetch(`${process.env.REACT_APP_API}/v1/queries`)
      .then((response) => response.json())
      .then((data) => this.cacheQueries(data.queries))
      .catch(console.log);
  }

  cacheQueries(queries) {
    if (queries.length) {
      const query = queries.shift();
      const urlQueryString = querystring.stringify({ q: query });
      fetch(`${process.env.REACT_APP_API}/v1/songs/search?${urlQueryString}`)
        .catch(console.log)
        .finally(() => this.cacheQueries(queries));
    }
  }

  render() {
    return null;
  }
}

export default Precache;