/*---------------------------------------------------------------------------*\
 |  App.js                                                                   |
 |                                                                           |
 |  Copyright © 2017-2019, Rajiv Bakulesh Shah, original author.             |
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
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducers from '../reducers/reducers';
import About from './About';
import Home from './Home';
import Logo from './Logo';

const store = createStore(reducers, applyMiddleware(thunk));

const App = () => (
  <Provider store={store}>
    <Router>
      <>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/:artistId/:songId" component={Home} />
          <Route exact path="/wtf" component={About} />
        </Switch>
        <Route component={Logo} />
      </>
    </Router>
  </Provider>
);

export default App;
