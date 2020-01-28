/*---------------------------------------------------------------------------*\
 |  Player.js                                                                |
 |                                                                           |
 |  Copyright © 2017-2020, Rajiv Bakulesh Shah, original author.             |
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
import { connect } from 'react-redux';
import '../monkey';
import { previousVideo, nextVideo, fetchQueue } from '../actions/player';
import { clearSearch } from '../actions/search';
import './Player.css';

class Player extends React.PureComponent {
  constructor(props) {
    super(props);
    this.NEXT_KEYS = [39];
    this.PREV_KEYS = [37];
  }

  componentDidMount() {
    document.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  onKeyUp = (eventObject) => {
    if (document.activeElement === document.body) {
      if (this.NEXT_KEYS.includes(eventObject.which)) {
        this.props.nextVideo();
      } else if (this.PREV_KEYS.includes(eventObject.which)) {
        this.props.previousVideo();
      }
    }
  }

  onVisibilityChange = () => {
    const video = document.getElementsByTagName('video')[0];
    if (video) {
      video[document.hidden ? 'pause' : 'play']();
    }
  }

  render() {
    return <ConnectedBuffer {...this.props} />;
  }
}

class Buffer extends React.Component {
  componentDidMount() {
    this.props.fetchQueue(this.props.artistId, this.props.songId);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.artistId !== prevProps.artistId
      || this.props.songId !== prevProps.songId
    ) {
      if (this.props.history.action !== 'REPLACE') {
        this.props.fetchQueue(this.props.artistId, this.props.songId);
      }
    }
  }

  render() {
    const videos = [];
    let states;

    if (
      this.props.player.index === null
      || this.props.player.index > this.props.player.queue.length - 1
    ) {
      states = [];
    } else if (
      this.props.player.index === this.props.player.queue.length - 1
      || this.props.state === 'background'
    ) {
      states = [this.props.state];
    } else {
      states = ['playing', 'buffering'];
    }

    states.forEach((state, index) => {
      const video = this.props.player.queue[this.props.player.index + index];
      const key = `/${video.artist__id}/${video.song__id}/${state}`;
      videos.push(
        <ConnectedVideo
          key={key}
          video={video}
          state={state}
          history={this.props.history}
        />
      );
    });

    return <div className="Player">{videos}</div>;
  }
}

class Video extends React.PureComponent {
  componentDidMount() {
    this.updateUrlAndTitle();
  }

  componentDidUpdate() {
    this.updateUrlAndTitle();
  }

  onMouseDown = (eventObject) => {
    if (this.props.state === 'playing') {
      if (eventObject.target.paused) {
        eventObject.target.play().catch(() => this.props.nextVideo());
      } else if (document.activeElement === document.body) {
        this.props.nextVideo();
      } else {
        this.props.clearSearch();
      }
    }
  }

  updateUrlAndTitle() {
    if (this.props.state === 'playing') {
      const { artist__id, song__id, artist, song } = this.props.video;
      this.props.history.replace(`/${artist__id}/${song__id}`);
      document.title = `Spool - ${artist} - ${song}`;
    }
  }

  render() {
    const className = this.props.state.capitalize();
    const iOS = !!navigator.userAgent.match(/iPhone|iPad|iPod/i);
    const muted = iOS || this.props.state !== 'playing';
    return (
      <video
        className={className}
        src={this.props.video.mp4_url}
        preload="auto"
        loop
        autoPlay={this.props.state === 'buffering' ? null : 'autoplay'}
        muted={muted}
        playsInline
        onMouseDown={this.onMouseDown}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  player: state.player,
});

const mapDispatchToProps = (dispatch) => ({
  previousVideo: () => dispatch(previousVideo()),
  nextVideo: () => dispatch(nextVideo()),
  fetchQueue: (artistId, songId) => dispatch(fetchQueue(artistId, songId)),
  clearSearch: () => dispatch(clearSearch()),
});

const ConnectedPlayer = connect(mapStateToProps, mapDispatchToProps)(Player);
const ConnectedBuffer = connect(mapStateToProps, mapDispatchToProps)(Buffer);
const ConnectedVideo = connect(mapStateToProps, mapDispatchToProps)(Video);

export default ConnectedPlayer;
