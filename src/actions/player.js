/*---------------------------------------------------------------------------*\
 |  player.js                                                                |
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
}

export const nextVideo = () => {
  return (dispatch) => {
    dispatch(nextVideoAction());
    if (videosRemaining() <= BATCH_SIZE / 2) {
      dispatch(fetchRandomSongs());
    }
  };
}

const fetchRandomSongs = () => {
  return (dispatch) => {
    if (videosRemaining() <= BATCH_SIZE / 2) {
      fetch(`${process.env.REACT_APP_API}/v1/songs`)
        .then((response) => response.json())
        .then((data) => dispatch(extendQueue(data.songs.shuffle())))
        .then(() => {
          if (store.getState().player.index === null) {
            dispatch(nextVideo());
          }
        })
        .catch(console.error);
    }
  };
}

export const fetchQueue = (artistId = null, songId = null) => {
  // TODO: Throw an error if artistId is null but songId isn't, or vice versa.
  return (dispatch) => {
    if (artistId !== null && songId !== null) {
      dispatch(clearQueue());
      fetch(`${process.env.REACT_APP_API}/v1/artists/${artistId}/songs/${songId}`)
        .then((response) => response.json())
        .then((data) => {
          dispatch(extendQueue(data.songs));
          dispatch(fetchRandomSongs());
        })
        .catch(console.error);
    } else {
      dispatch(fetchRandomSongs());
    }
  };
}
