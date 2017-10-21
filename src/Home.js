/*---------------------------------------------------------------------------*\
 |  Home.js                                                                  |
 |                                                                           |
 |  Copyright © 2017, Rajiv Bakulesh Shah, original author.                  |
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
import Player from './Player';
import Search from './Search';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.resetSearch = this.resetSearch.bind(this);
    this.state = {
      query: this.props.query || '',
      results: this.props.results || [],
    }
  }

  resetSearch() {
    this.setState({ query: '', results: [] });
  }

  render() {
    let artistId, songId;
    if (this.props.match) {
      artistId = this.props.match.params.artistId;
      songId = this.props.match.params.songId;
    } else {
      [artistId, songId] = [null, null];
    }
    return (
      <div>
        <Player
          state='playing'
          artistId={artistId}
          songId={songId}
          resetSearch={this.resetSearch}
          history={this.props.history}
        />
        <Search
          query={this.state.query}
          results={this.state.results}
          history={this.props.history}
        />
      </div>
    );
  }
}

export default Home;
