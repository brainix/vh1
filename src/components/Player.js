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

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import '../monkey';
import { previousVideo, nextVideo, fetchQueue } from '../actions/player';
import { clearSearch } from '../actions/search';
import './Player.css';

const Player = React.memo(function Player(props) {
  useEffect(() => {
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
    // eslint-disable-next-line
  }, []);

  function onKeyUp(eventObject) {
    const NEXT_KEYS = [39];
    const PREV_KEYS = [37];

    if (document.activeElement === document.body) {
      if (NEXT_KEYS.includes(eventObject.which)) {
        props.nextVideo();
      } else if (PREV_KEYS.includes(eventObject.which)) {
        props.previousVideo();
      }
    }
  }

  function onVisibilityChange() {
    const video = document.getElementsByTagName('video')[0];
    if (video) {
      video[document.hidden ? 'pause' : 'play']();
    }
  }

  return <ConnectedBuffer {...props} />;
});

let mapStateToProps = (state) => ({});

let mapDispatchToProps = (dispatch) => ({
  previousVideo: () => dispatch(previousVideo()),
  nextVideo: () => dispatch(nextVideo()),
});

const ConnectedPlayer = connect(mapStateToProps, mapDispatchToProps)(Player);

const Buffer = React.memo(function Buffer(props) {
  const [prevArtistId, setPrevArtistId] = useState(null);
  const [prevSongId, setPrevSongId] = useState(null);
  const { artistId, songId } = props;
  useEffect(() => {
    if (
      prevArtistId === null || prevSongId === null
      || (props.history.action !== 'REPLACE' && (prevArtistId !== artistId || prevSongId !== songId))
    ) {
      props.fetchQueue(artistId, songId);
    }
    setPrevArtistId(artistId);
    setPrevSongId(songId);
    // eslint-disable-next-line
  }, [artistId, songId]);

  let states;
  if (
    props.player.index === null
    || props.player.index > props.player.queue.length - 1
  ) {
    states = [];
  } else if (
    props.player.index === props.player.queue.length - 1
    || props.state === 'background'
  ) {
    states = [props.state];
  } else {
    states = ['playing', 'buffering'];
  }

  const videos = [];
  states.forEach((state, index) => {
    const video = props.player.queue[props.player.index + index];
    videos.push(
      <ConnectedVideo
        key={state}
        video={video}
        state={state}
        history={props.history}
      />
    );
  });
  return <div className="Player">{videos}</div>;
});

mapStateToProps = (state) => ({
  player: state.player,
});

mapDispatchToProps = (dispatch) => ({
  fetchQueue: (artistId, songId) => dispatch(fetchQueue(artistId, songId)),
});

const ConnectedBuffer = connect(mapStateToProps, mapDispatchToProps)(Buffer);

const Video = React.memo(function Video(props) {
  function updateUrlAndTitle() {
    if (props.state === 'playing') {
      const { artist__id, song__id, artist, song } = props.video;
      props.history.replace(`/${artist__id}/${song__id}`);
      document.title = `Spool - ${artist} - ${song}`;
    }
  }

  useEffect(updateUrlAndTitle);

  function onMouseDown(eventObject) {
    if (props.state === 'playing') {
      if (eventObject.target.paused) {
        eventObject.target.play().catch(() => props.nextVideo());
      } else if (document.activeElement === document.body) {
        props.nextVideo();
      } else {
        props.clearSearch();
      }
    }
  }

  const className = props.state.capitalize();
  return (
    <>
      <video
        className={className}
        src={props.video.mp4_url}
        preload="auto"
        loop
        autoPlay={props.state === 'buffering' ? null : 'autoplay'}
        muted={props.state !== 'playing'}
        playsInline
        onMouseDown={onMouseDown}
      />
      <Credits video={props.video} state={props.state} />
    </>
  );
});

mapStateToProps = (state) => ({});

mapDispatchToProps = (dispatch) => ({
  nextVideo: () => dispatch(nextVideo()),
  clearSearch: () => dispatch(clearSearch()),
});

const ConnectedVideo = connect(mapStateToProps, mapDispatchToProps)(Video);

const Credits = React.memo(function Credits(props) {
  if (props.state !== 'playing') {
    return null;
  }

  const { artist, song, album } = props.video;
  const cleanArtist = artist.cleanName();
  const cleanSong = song.cleanName();
  const cleanAlbum = album ? album.cleanName() : null;

  return (
    <figure className="Playing">
      <span dangerouslySetInnerHTML={{ __html: cleanArtist }} title={artist} />
      <br />
      <span dangerouslySetInnerHTML={{ __html: cleanSong }} title={song} />
      {cleanAlbum &&
        <>
          <br />
          <span dangerouslySetInnerHTML={{ __html: cleanAlbum }} title={album} />
        </>
      }
    </figure>
  );
});

export default ConnectedPlayer;
