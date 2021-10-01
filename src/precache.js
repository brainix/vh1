/*---------------------------------------------------------------------------*\
 |  precache.js                                                              |
\*---------------------------------------------------------------------------*/

const querystring = require('querystring');

async function getQueries() {
  const url = `${process.env.REACT_APP_API}/v1/queries`;
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
  const urlQueryString = querystring.stringify({ q: query });
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
