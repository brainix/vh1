/*---------------------------------------------------------------------------*\
 |  store.js                                                                 |
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

import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import * as Sentry from "@sentry/react";
import reducers from './reducers/reducers';

const sentryReduxEnhancer = Sentry.createReduxEnhancer({});

const store = createStore(
  reducers,
  compose(applyMiddleware(thunk), sentryReduxEnhancer),
);

export default store;
