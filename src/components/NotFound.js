/*---------------------------------------------------------------------------*\
 |  NotFound.js                                                              |
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
          And my heart was filled with mourning, mourning for my dear amour.<br />
          &ldquo;&rsquo;Tis not possible;&rdquo; I muttered, &ldquo;give me back my free hardcore!&rdquo;&mdash;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Quoth the Server &ldquo;<a href='http://bash.org/?120296'>404</a>.&rdquo;
        </p>
        <p><Link to='/'>&larr; home</Link></p>
      </section>
    </>
  );
});

export default withRouter(NotFound);
