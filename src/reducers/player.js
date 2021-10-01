/*---------------------------------------------------------------------------*\
 |  player.js                                                                |
\*---------------------------------------------------------------------------*/

const playerReducer = (state = {queue: [], index: null}, action) => {
  switch (action.type) {
    case 'player/clearQueue':
      return { queue: [], index: null };
    case 'player/extendQueue':
      return { ...state, queue: state.queue.concat(action.queue) };
    case 'player/previousVideo':
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
    case 'player/nextVideo':
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
