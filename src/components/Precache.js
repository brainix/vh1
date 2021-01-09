/*---------------------------------------------------------------------------*\
 |  Precache.js                                                              |
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

import React, { useEffect } from 'react';

const querystring = require('querystring');

async function getQueries() {
  try {
    const url = `${process.env.REACT_APP_API}/v1/queries`;
    const response = await fetch(url);
    const data = await response.json();
    cacheQueries(data.queries);
  } catch (e) {
    console.error(e);
  }
}

async function cacheQueries(queries) {
  if (queries.length) {
    const query = queries.shift();
    const urlQueryString = querystring.stringify({ q: query });
    const url = `${process.env.REACT_APP_API}/v1/songs/search?${urlQueryString}`;
    try {
      const response = await fetch(url);
    } catch (e) {
      console.error(e);
    } finally {
      cacheQueries(queries);
    }
  }
}

const Precache = React.memo(function Precache() {
  useEffect(getQueries, []);

  return null;
});

export default Precache;
