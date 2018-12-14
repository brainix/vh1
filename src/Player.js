/*---------------------------------------------------------------------------*\
 |  Player.js                                                                |
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
import './Player.css';
import './monkey';

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
    if (this.refs.buffer && document.activeElement === document.body) {
      if (this.NEXT_KEYS.includes(eventObject.which)) {
        this.refs.buffer.nextVideo();
      } else if (this.PREV_KEYS.includes(eventObject.which)) {
        this.refs.buffer.prevVideo();
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
    return <Buffer {...this.props} ref="buffer" />;
  }
}

class Buffer extends React.Component {
  constructor(props) {
    super(props);
    this.BATCH_SIZE = 60;
    this.videos = [];
    this.state = null;
  }

  componentDidMount() {
    this.initVideos();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.artistId !== prevProps.artistId
      || this.props.songId !== prevProps.songId
    ) {
      if (this.props.history.action !== 'REPLACE') {
        this.videos = [];
        this.initVideos();
      }
    }
  }

  initVideos() {
    if (this.videos.length === 0) {
      if (this.props.artistId && this.props.songId) {
        const { artistId, songId } = this.props;
        fetch(`${process.env.REACT_APP_API}/artists/${artistId}/songs/${songId}`)
          .then(response => response.json())
          .then(data => {
            this.videos = [data.songs[0]];
            this.moreVideos(true);
          })
          .catch(console.log);
      } else {
        this.moreVideos(true);
      }
    }
  }

  moreVideos(init) {
    fetch(`${process.env.REACT_APP_API}/songs`)
      .then(response => response.json())
      .then(data => {
        this.videos = this.videos.concat(data.songs.shuffle());
        if (init) {
          this.setState({ index: 0 });
        }
      })
      .catch(console.log);
  }

  nextVideo = () => {
    if (this.state.index !== null) {
      if (this.state.index < this.videos.length - 1) {
        this.setState({ index: this.state.index + 1 });
      }
      if (this.state.index >= this.videos.length - this.BATCH_SIZE / 2) {
        this.moreVideos(false);
      }
    }
  }

  prevVideo = () => {
    if (this.state.index !== null && this.state.index > 0) {
      this.setState({ index: this.state.index - 1 });
    }
  }

  render() {
    const videos = [];
    let states;

    if (
      this.state === null
      || this.state.index === null
      || this.state.index > this.videos.length - 1
    ) {
      states = [];
    } else if (
      this.state.index === this.videos.length - 1
      || this.props.state === 'background'
    ) {
      states = [this.props.state];
    } else {
      states = ['playing', 'buffering'];
    }

    states.forEach((state, index) => {
      const video = this.videos[this.state.index + index];
      const key = `/${video.artist__id}/${video.song__id}/${state}`;
      videos.push(
        <Video
          key={key}
          video={video}
          state={state}
          nextVideo={this.nextVideo}
          resetSearch={this.props.resetSearch}
          history={this.props.history}
        />
      );
    });

    return <div className="Player">{videos}</div>;
  }
}

class Video extends React.PureComponent {
  constructor(props) {
    super(props);
  }

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
        this.props.resetSearch();
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
    return (
      <video
        className={className}
        src={this.props.video.mp4_url}
        preload="auto"
        loop
        autoPlay={this.props.state === 'buffering' ? null : 'autoplay'}
        muted={this.props.state !== 'playing'}
        playsInline
        onMouseDown={this.onMouseDown}
      />
    );
  }
}

export default Player;
