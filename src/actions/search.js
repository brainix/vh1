/*---------------------------------------------------------------------------*\
 |  search.js                                                                |
\*---------------------------------------------------------------------------*/

import store from '../store';

const querystring = require('querystring');

const setQuery = (query) => ({ type: 'search/setQuery', query });
const showResults = (results) => ({ type: 'search/showResults', results });
export const setSelected = (index) => ({ type: 'search/setSelected', index });
export const clearSearch = () => ({ type: 'search/clearSearch' });

const EASTER_EGGS = {
  porn: [
    'https://www.pornhub.com/',
  ],
  rickroll: [
    'https://spool.video/rick-astley/never-gonna-give-you-up',
  ],
};

export const executeSearch = (query) => {
  return async (dispatch) => {
    if (!query) {
      dispatch(clearSearch());
      return;
    }

    dispatch(setQuery(query));

    const normalizedQuery = query.normalize();
    if (normalizedQuery in EASTER_EGGS) {
      const webpage = EASTER_EGGS[normalizedQuery].choice();
      window.location.href = webpage;
    }

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
  };
};
