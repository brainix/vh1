/*---------------------------------------------------------------------------*\
 |  App.js                                                                   |
\*---------------------------------------------------------------------------*/

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import '../cassette';
import '../precache';
import store from '../store';
import About from './About';
import Home from './Home';
import Logo from './Logo';
import NotFound from './NotFound';


const App = React.memo(function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/:artistId/:songId" component={Home} />
          <Route exact path="/wtf" component={About} />
          <Route component={NotFound} />
        </Switch>
        <Route component={Logo} />
      </Router>
    </Provider>
  );
});

export default App;
