/*---------------------------------------------------------------------------*\
 |  player.js                                                                |
\*---------------------------------------------------------------------------*/

import { v4 as uuidv4 } from 'uuid';
import store from '../store';

const querystring = require('querystring');

const BATCH_SIZE = 60;

const clearQueue = () => ({ type: 'player/clearQueue' });
const extendQueue = (queue) => ({ type: 'player/extendQueue', queue });
export const previousVideo = () => ({ type: 'player/previousVideo' });
const nextVideoAction = () => ({ type: 'player/nextVideo' });

const videosRemaining = () => {
  const queueLength = store.getState().player.queue.length;
  let index = store.getState().player.index;
  if (index === null) {
    index = -1;
  }
  return queueLength - index - 1;
};

export const nextVideo = () => {
  return (dispatch) => {
    dispatch(nextVideoAction());
    if (videosRemaining() <= BATCH_SIZE / 2) {
      dispatch(fetchRandomSongs());
    }
  };
};

const fetchRandomSongs = () => {
  return async (dispatch) => {
    if (videosRemaining() <= BATCH_SIZE / 2) {
      try {
        const uuid = uuidv4();
        const urlQueryString = querystring.stringify({ uuid });
        const url = `${process.env.REACT_APP_API}/v1/songs?${urlQueryString}`;
        const response = await fetch(url);
        const data = await response.json();
        const songs = data.songs.shuffle();
        dispatch(extendQueue(songs));
      } catch(e) {
        console.error(e);
      }
      if (store.getState().player.index === null) {
        dispatch(nextVideo());
      }
    }
  };
};

export const fetchQueue = (artistId = null, songId = null) => {
  // TODO: Throw an error if artistId is null but songId isn't, or vice versa.
  return async (dispatch) => {
    if (artistId !== null && songId !== null) {
      dispatch(clearQueue());
      try {
        const uuid = uuidv4();
        const urlQueryString = querystring.stringify({ uuid });
        const url = `${process.env.REACT_APP_API}/v1/artists/${artistId}/songs/${songId}?${urlQueryString}`;
        const response = await fetch(url);
        const data = await response.json();
        dispatch(extendQueue(data.songs));
      } catch(e) {
        console.error(e);
      }
    }
    dispatch(fetchRandomSongs());
  };
};
