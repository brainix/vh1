/*---------------------------------------------------------------------------*\
 |  Home.test.js                                                             |
\*---------------------------------------------------------------------------*/

import React from 'react';
import ReactDOM from 'react-dom';
import '../requestAnimationFrame';
import Home from './Home';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Home />, div);
});
