/*---------------------------------------------------------------------------*\
 |  player.js                                                                |
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

import store from '../store';

export const CLEAR_QUEUE = 'CLEAR_QUEUE';
export const EXTEND_QUEUE = 'EXTEND_QUEUE';
export const PREVIOUS_VIDEO = 'PREVIOUS_VIDEO';
export const NEXT_VIDEO = 'NEXT_VIDEO';

const BATCH_SIZE = 60;

const clearQueue = () => ({ type: CLEAR_QUEUE });
const extendQueue = (queue) => ({ type: EXTEND_QUEUE, queue });
export const previousVideo = () => ({ type: PREVIOUS_VIDEO });
const nextVideoAction = () => ({ type: NEXT_VIDEO });

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
        .catch(console.log);
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
        .catch(console.log);
    } else {
      dispatch(fetchRandomSongs());
    }
  };
}
