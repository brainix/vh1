/*---------------------------------------------------------------------------*\
 |  App.js                                                                   |
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

import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';

import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import store from '../store';
import About from './About';
import Home from './Home';
import Logo from './Logo';
import Precache from './Precache';

const history = createBrowserHistory();

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: "https://ac4fccd7346c4547a5a0592a390f1182@o476106.ingest.sentry.io/5516489",
    integrations: [
      new Integrations.BrowserTracing({
        routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
      }),
    ],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
}

const App = React.memo(function App() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/:artistId/:songId" component={Home} />
          <Route exact path="/wtf" component={About} />
        </Switch>
        <Route component={Logo} />
      </Router>
      <Precache />
    </Provider>
  );
});

export default Sentry.withProfiler(App);
