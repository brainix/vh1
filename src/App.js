/*---------------------------------------------------------------------------*\
 |  App.js                                                                   |
 |                                                                           |
 |  Copyright © 2017-2018, Rajiv Bakulesh Shah, original author.             |
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
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import About from './About';
import Home from './Home';
import Logo from './Logo';

const App = () => (
  <Router>
    <>
      <Switch>
        <Route exact path="/" component={withRouter(Home)} />
        <Route path="/:artistId/:songId" component={withRouter(Home)} />
        <Route exact path="/wtf" component={withRouter(About)} />
      </Switch>
      <Route component={Logo} />
    </>
  </Router>
);

export default App;
