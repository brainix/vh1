/*---------------------------------------------------------------------------*\
 |  Logo.js                                                                  |
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
import { Link } from 'react-router-dom';
import src from './logo.png';
import './Logo.css';

const Logo = (props) => {
  let linkTo, alt;
  if (props.location.pathname === '/wtf') {
    [linkTo, alt] = ['/', 'Home'];
  } else {
    [linkTo, alt] = ['/wtf', 'WTF?'];
  }

  return (
    <Link className="Logo" to={linkTo}>
      <img src={src} alt={alt} title={alt} />
    </Link>
  );
};

export default Logo;