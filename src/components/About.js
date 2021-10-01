/*---------------------------------------------------------------------------*\
 |  About.js                                                                 |
\*---------------------------------------------------------------------------*/

import React, { useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Player from './Player';
import './About.css';

const About = React.memo(function About(props) {
  useEffect(() => {
    document.title = 'Spool - About Me';
  });

  return (
    <>
      <Player state='background' history={props.history} />
      <section className="About">
        <h1>About Me</h1>

        <h2>What is Spool?</h2>
        <p>
          <Link to='/'>Spool</Link> takes the experience of channel surfing and
          puts it online.  I hope that you enjoy using it as much as I&rsquo;ve
          enjoyed building it.
        </p>

        <h2>Just &hellip; Why?</h2>
        <p>
          I want to build something frivolous, but I want it to be worthless in
          a&nbsp;
          <a href='https://www.producthunt.com/posts/spool-tv'>particular way</a>.
          Inexplicable like <small>MTV,</small> <small>IRC,</small> or iCarly.
        </p>

        <h2>How can I contact you?</h2>
        <p>
          Find me on Reddit
          (<a href='https://www.reddit.com/user/Brainix'>u/Brainix</a>),
          email me
          (<a href='mailto:brainix@gmail.com'>brainix@gmail.com</a>),
          or have coffee with me any time in San Francisco.
        </p>
      </section>
    </>
  );
});

export default withRouter(About);
