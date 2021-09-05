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
import { Link, withRouter } from 'react-router-dom';
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
        <p className="TheRaven">
          Once upon a midnight dreary, while I porn surfed, weak and weary,<br />
          Over many a strange and spurious website of &lsquo;hot chicks galore&rsquo;&mdash;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;While I clicked my fav&rsquo;rite bookmark, suddenly there came a warning,<br />
          And my heart was filled with mourning, mourning for nudes I adore.<br />
          &ldquo;&rsquo;Tis not possible;&rdquo; I muttered, &ldquo;give me back my free hardcore!&rdquo;&mdash;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Quoth the Server &ldquo;<a href='http://bash.org/?120296'>404</a>.&rdquo;
        </p>
        <p><Link to='/'>&larr; home</Link></p>
      </section>
    </>
  );
});

export default withRouter(NotFound);
