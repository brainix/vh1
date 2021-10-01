/*---------------------------------------------------------------------------*\
 |  player.js                                                                |
\*---------------------------------------------------------------------------*/

import store from '../store';

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
        const url = `${process.env.REACT_APP_API}/v1/songs`;
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
        const url = `${process.env.REACT_APP_API}/v1/artists/${artistId}/songs/${songId}`;
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
