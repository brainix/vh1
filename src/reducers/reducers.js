/*---------------------------------------------------------------------------*\
 |  reducers.js                                                              |
\*---------------------------------------------------------------------------*/

import { combineReducers } from 'redux';
import playerReducer from './player';
import searchReducer from './search';

const reducers = combineReducers({
  player: playerReducer,
  search: searchReducer,
});

export default reducers;
