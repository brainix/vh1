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

import { CLEAR_QUEUE, EXTEND_QUEUE, PREVIOUS_VIDEO, NEXT_VIDEO } from '../actions/player';

const playerReducer = (state = {queue: [], index: null}, action) => {
  switch (action.type) {
    case CLEAR_QUEUE:
      return { queue: [], index: null };
    case EXTEND_QUEUE:
      return { ...state, queue: state.queue.concat(action.queue) };
    case PREVIOUS_VIDEO:
      if (!state.queue.length) {
        // The queue is empty; we cannot move on to the previous video.
        return state;
      } else if (state.index === null) {
        // The queue is not empty; but we haven't yet moved on to the first
        // video.
        return state;
      } else if (state.index === 0) {
        // The queue is not empty; but we're already on the first video.
        return state;
      } else {
        return { ...state, index: state.index - 1 }
      }
    case NEXT_VIDEO:
      if (!state.queue.length) {
        // The queue is empty; we cannot move on to the next video.
        return state;
      } else if (state.index === null) {
        // The queue is not empty; move on to the first video.
        return { ...state, index: 0 }
      } else if (state.index === state.queue.length - 1) {
        // The queue is not empty; but we're already on the last video.
        return state;
      } else {
        return { ...state, index: state.index + 1 }
      }
    default:
      return state;
  }
};

export default playerReducer;
