/*---------------------------------------------------------------------------*\
 |  search.js                                                                |
\*---------------------------------------------------------------------------*/

import { v4 as uuidv4 } from 'uuid';
import store from '../store';

const setQuery = (query, uuid) => ({ type: 'search/setQuery', query, uuid });
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
  wordle: [
    'https://powerlanguage.co.uk/wordle/',
  ],
};

export const executeSearch = (query) => {
  return async (dispatch) => {
    if (!query) {
      dispatch(clearSearch());
      return;
    }
    const uuid = uuidv4();
    dispatch(setQuery(query, uuid));

    const normalizedQuery = query.normalize();
    if (normalizedQuery in EASTER_EGGS) {
      const webpage = EASTER_EGGS[normalizedQuery].choice();
      window.location.href = webpage;
    }

    const urlQueryString = new URLSearchParams(`q=${query}&uuid=${uuid}`);
    const url = `${process.env.REACT_APP_API}/v1/songs/search?${urlQueryString}`;
    const response = await fetch(url);
    if (response.status !== 200) {
      console.error(`GET ${url} returned ${response.status} status code`)
      dispatch(showResults([]));
      return;
    }
    const data = await response.json();
    if (data.metadata.uuid === store.getState().search.uuid) {
      dispatch(showResults(data.songs));
      recordQuery(query);
    }
  };
};

const recordQuery = (query) => {
  const uuid = uuidv4();
  const urlQueryString = new URLSearchParams(`uuid=${uuid}`);
  const url = `${process.env.REACT_APP_API}/v1/queries?${urlQueryString}`;
  const [method, body] = ['POST', new FormData()];
  body.append('q', query);
  fetch(url, { method, body })
    .catch(console.error);
};
