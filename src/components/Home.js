/*---------------------------------------------------------------------------*\
 |  Home.js                                                                  |
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

import React from 'react';
import { withRouter } from 'react-router-dom';
import Player from './Player';
import Search from './Search';

const Home = React.memo(function Home(props) {
  let [artistId, songId] = [null, null];
  if (props.match) {
    ({ artistId, songId } = props.match.params);
  }

  return (
    <>
      <Player
        state="playing"
        artistId={artistId}
        songId={songId}
        history={props.history}
      />
      <Search history={props.history} />
    </>
  );
});

export default withRouter(Home);
