/*---------------------------------------------------------------------------*\
 |  Player.js                                                                |
\*---------------------------------------------------------------------------*/

import React, { useEffect, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import '../monkey';
import { previousVideo, nextVideo, fetchQueue } from '../actions/player';
import { clearSearch } from '../actions/search';
import './Player.css';

const Player = React.memo(function Player(props) {
  useEffect(() => {
    document.addEventListener('keyup', nextVideo);
    document.addEventListener('visibilitychange', togglePlayPause);
    document.activeElement.blur();
    return () => {
      document.removeEventListener('keyup', nextVideo);
      document.removeEventListener('visibilitychange', togglePlayPause);
    };
    // eslint-disable-next-line
  }, []);

  function nextVideo(eventObject) {
    const NEXT_KEYS = [39];
    const PREV_KEYS = [37];

    if (document.activeElement === document.body && props.state === 'playing') {
      if (NEXT_KEYS.includes(eventObject.which)) {
        props.nextVideo();
      } else if (PREV_KEYS.includes(eventObject.which)) {
        props.previousVideo();
      }
    }
  }

  function togglePlayPause() {
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
  const [prevArtistId, setPrevArtistId] = useState(undefined);
  const [prevSongId, setPrevSongId] = useState(undefined);
  const { artistId, songId } = props;
  useEffect(() => {
    if (!props.player.queue.length) {
      console.log('The queue is empty; fetching videos');
      props.fetchQueue(artistId, songId);
    } else if (
      props.history.action !== 'REPLACE'
      && (prevArtistId !== artistId || prevSongId !== songId)
    ) {
      console.log('The artist ID or song ID has changed; fetching videos');
      props.fetchQueue(artistId, songId);
    }
    setPrevArtistId(artistId);
    setPrevSongId(songId);
    // eslint-disable-next-line
  }, [artistId, songId]);

  let states = ['playing', 'buffering'];
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
  const { state } = props;
  const { artist__id, song__id, artist, song } = props.video;
  useEffect(() => {
    if (state === 'playing') {
      props.history.replace(`/${artist__id}/${song__id}`);
      document.title = `Spool - ${artist} - ${song}`;
    }
    // eslint-disable-next-line
  }, [state, artist__id, song__id, artist, song]);

  const nextVideo = useCallback((eventObject) => {
    if (props.state === 'playing') {
      if (eventObject.target.paused) {
        eventObject.target.play().catch(props.nextVideo);
      } else if (document.activeElement === document.body) {
        props.nextVideo();
      } else {
        props.clearSearch();
      }
    }
  }, []);

  const className = props.state.capitalize();
  return (
    <>
      <video
        className={className}
        src={props.video.mp4_url}
        preload="auto"
        loop={true}
        autoPlay={props.state === 'buffering' ? null : 'autoplay'}
        muted={props.state !== 'playing'}
        playsInline={true}
        onMouseDown={nextVideo}
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
          <span
            dangerouslySetInnerHTML={{ __html: cleanAlbum }}
            title={album}
          />
        </>
      }
    </figure>
  );
});

export default ConnectedPlayer;
