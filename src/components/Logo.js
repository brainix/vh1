/*---------------------------------------------------------------------------*\
 |  Logo.js                                                                  |
\*---------------------------------------------------------------------------*/

import React from 'react';
import { Link } from 'react-router-dom';
import src from './logo.png';
import './Logo.css';

const Logo = React.memo(function Logo(props) {
  let [className, linkTo, alt] = ['Logo WTF', '/wtf', 'WTF?'];
  if (props.location.pathname === '/wtf') {
    [className, linkTo, alt] = ['Logo Home', '/', 'Home'];
  }

  return (
    <Link className={className} to={linkTo}>
      <img src={src} alt={alt} title={alt} loading="lazy" />
    </Link>
  );
});

export default Logo;
