/*---------------------------------------------------------------------------*\
 |  NotFound.js                                                              |
 |                                                                           |
 |  Copyright © 2017-2021, Rajiv Bakulesh Shah, original author.             |
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

import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Player from './Player';
import './About.css';

const NotFound = React.memo(function NotFound(props) {
  useEffect(() => {
    document.title = 'Spool - 404 - Not Found';
  });

  return (
    <>
      <Player state='background' history={props.history} />
      <section className="About">
        <h1>404 &mdash; Not Found</h1>
      </section>
    </>
  );
});

export default withRouter(NotFound);
