/*---------------------------------------------------------------------------*\
 |  Home.js                                                                  |
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
