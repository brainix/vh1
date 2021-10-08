/*---------------------------------------------------------------------------*\
 |  precache.js                                                              |
\*---------------------------------------------------------------------------*/

import { v4 as uuidv4 } from 'uuid';

const querystring = require('querystring');

async function getQueries() {
  const uuid = uuidv4();
  const urlQueryString = querystring.stringify({ uuid });
  const url = `${process.env.REACT_APP_API}/v1/queries?${urlQueryString}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    cacheQueries(data.queries);
  } catch (e) {
    console.error(e);
  }
}

async function cacheQueries(queries) {
  if (!queries.length) {
    return;
  }

  const query = queries.shift();
  const uuid = uuidv4();
  const urlQueryString = querystring.stringify({ q: query, uuid });
  const url = `${process.env.REACT_APP_API}/v1/songs/search?${urlQueryString}`;
  try {
    await fetch(url);
  } catch (e) {
    console.error(e);
  } finally {
    cacheQueries(queries);
  }
}

getQueries();
