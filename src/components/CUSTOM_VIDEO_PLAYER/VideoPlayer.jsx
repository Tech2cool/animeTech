import React, { useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import Container from '@mui/material/Container';
import screenfull from 'screenfull';
import CircularProgress from '@mui/material/CircularProgress';

import './VideoPlayer.css';
import Control from './Control';
import {
  KeyboardArrowRight, KeyboardArrowLeft, Tune, PlayCircleFilledWhiteOutlined
} from '@mui/icons-material';
// let count = 0;
import { debounce } from 'lodash';

const VideoPlayer = ({ url }) => {
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  // const controlRef = useRef(null);
  const [showQuality, setShowQuality] = useState(false);
  const [showPlaybackRate, setshowPlaybackRate] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const [setting, setSetting] = useState(false);
  const [showControlbar, setShowControlbar] = useState(false);
  const [levels, setLevels] = useState([]);
  const [currentQuality, setCurrentQuality] = useState(0);
  const [seekTime, setSeekTime] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const playbackRates = [0.25, 0.50, 1.0, 1.50, 2.0, 2.50, 3.0]
  const [videoState, setVideoState] = useState({
    playing: false,
    muted: false,
    volume: 0.5,
    playbackRate: 1.0,
    played: 0,
    seeking: false,
    buffer: true,
    isFullScreen: false,
    pipMode: false,
    showTitle: false,
    title: null,
  });
  const count = useRef(1);
  // const newSeekTime = 10; // Fixed seek time
  const key = {
    escape: 27,
    space: 32,
    left: 37,
    right: 39,
    F: 70,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
  }

  const [vSlider, setVSlider] = useState(false);
  //Destructuring the properties from the videoState
  const { playing, muted, volume, playbackRate, played, seeking, buffer,
    isFullScreen, pipMode, title, showTitle } = videoState;
  const currentTime = playerRef.current ? playerRef.current.getCurrentTime() : "00:00";
  const duration = playerRef.current ? playerRef.current.getDuration() : "00:00";

  const formatCurrentTime = formatTime(currentTime);
  const formatDuration = formatTime(duration);
  const storageKey = `videoPlaybackTime_${url}`;

  const handlePlayerReady = () => {
    const internalPlayer = playerRef.current?.getInternalPlayer('hls');

    if (internalPlayer) {
      setLevels(internalPlayer.levels);

      const storedTime = localStorage.getItem(storageKey);
      playerRef.current.seekTo(parseFloat(storedTime));
    }
    else {
      const player = playerRef.current?.getInternalPlayer();
      if (player) {
        setCurrentQuality(player.videoHeight);
      }
      const storedTime = localStorage.getItem(storageKey);
      playerRef.current.seekTo(parseFloat(storedTime));

    }
  };
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const progressHandler = (state) => {
    if (count.current > 2) {

      setSetting(false);
      setShowQuality(false);
      setShowSetting(false);
      setshowPlaybackRate(false);
      setVSlider(false);
      setVideoState({ ...videoState, showTitle: false })
      if (!isFocused){
        setShowControlbar(false);
        count.current=1;
      }
      // controlRef.current.style.visibility = "hidden";

    } else if (showControlbar) {
      if (!isFocused) count.current++;
    }

    if (!seeking) {
      // setVideoState({ ...videoState, played: state.played });
      // console.log(state)
      setVideoState((prevVideoState) => ({
        ...prevVideoState,
        played: state.played,
      }));

      localStorage.setItem(storageKey, state.playedSeconds);
    }
    const internalPlayer = playerRef.current?.getInternalPlayer('hls');

    if (internalPlayer) {
      const newLevel = internalPlayer.currentLevel;
      const initialHeight = internalPlayer.levels[newLevel]?.height;

      if (initialHeight !== currentQuality) {
        // console.log('Level changed:', initialHeight);
        setCurrentQuality(initialHeight);
      }
    }
    const player = playerRef.current?.getInternalPlayer();
    if (player) {
      player.videoHeight !== currentQuality && setCurrentQuality(player.videoHeight);
      // console.log('Video resolution:', player.videoWidth, 'x', player.videoHeight);
    }

  };


  const handleSetting = () => {
    if (setting && showSetting) {
      setSetting(false);
      setShowSetting(false);
    } else {
      setSetting(true);
      setShowSetting(true);
    }
    setShowQuality(false);
    setshowPlaybackRate(false);
  }

  const setPlaybackRate = (event) => {
    const target = event.target;
    // console.log(rate);
    // setVideoState({...videoState, playbackRate: rate});
    setVideoState({ ...videoState, playbackRate: parseFloat(target.dataset.value) });
    setSetting(false);
    setShowSetting(false);
    setshowPlaybackRate(false);

  }
  const handleVideoEnd = ()=>{
    playPauseHandler();
  }
  const playPauseHandler = () => {
    //plays and pause the video (toggling)
    setVideoState({ ...videoState, playing: !videoState.playing });
  };

  const handlePip = () => {
    setVideoState({ ...videoState, pipMode: !videoState.pipMode });
    // console.log("pip")
  };

  const handleFullScreen = () => {
    if (screenfull.isEnabled) {
      if (!videoState.isFullScreen) {
        // Entering fullscreen
        if (playerContainerRef.current) {
          screenfull.request(playerContainerRef.current);
          // Check if screen.orientation.lock is supported before using it
          window?.screen?.orientation?.lock('landscape')?.catch(error => {
            console.error('Unable to lock screen orientation:', error);
          });
          playerContainerRef.current.focus({focusVisible: true})
        }
      } else {
        // Exiting fullscreen
        screenfull.exit();
        // Check if screen.orientation.unlock is supported before using it
        window?.screen?.orientation?.unlock?.();
      }
      setIsFocused(false);
      setVideoState({ ...videoState, isFullScreen: !videoState.isFullScreen });
    }
  };
  const [showRewindSeekTime, setShowRewindSeekTime] = useState(false);
  const [showForwardSeekTime, setShowForwardSeekTime] = useState(false);

  const handleRewind = (newSeekTime = 10) => {
    if (playerRef.current.getCurrentTime() >= 10) {
      playerRef.current.seekTo(parseInt(playerRef.current.getCurrentTime()) - newSeekTime, 'seconds');
      // Update total seek time
      setSeekTime(seekTime - newSeekTime);

      // Show total seek time for 2 seconds
      setShowRewindSeekTime(true);
      setTimeout(() => {
        setShowRewindSeekTime(false);
        setSeekTime(0);
      }, 3000);
    }
  };

  const handleFastFoward = (newSeekTime = 10) => {
    if (playerRef.current.getCurrentTime() <= playerRef.current.getDuration()) {
      playerRef.current.seekTo(parseInt(playerRef.current.getCurrentTime()) + newSeekTime, 'seconds');
      // Update total seek time
      setSeekTime(seekTime + newSeekTime);

      setShowForwardSeekTime(true);
      setTimeout(() => {
        setShowForwardSeekTime(false);
        setSeekTime(0);
      }, 3000);
    }
  };

  const debouncedHandleMiddleScreenClick = useRef(
    debounce(() => {
      setting && setSetting(false);
      showQuality && setShowQuality(false);
      showSetting && setShowSetting(false);
      showPlaybackRate && setshowPlaybackRate(false);
      vSlider && setVSlider(false);
      // controlRef.current.style.visibility = "hidden";
      setShowControlbar(false);
    }, 300) // Adjust the debounce delay as needed (e.g., 300 milliseconds)
  ).current;

  const handleMiddleScreenClick = () => {
    debouncedHandleMiddleScreenClick();
  }

  const seekMouseUpHandler = (e, value) => {
    // console.log(value);

    setVideoState({ ...videoState, seeking: false });
    playerRef.current.seekTo(value / 100);
  };

  const volumeChangeHandler = (e, value) => {
    const newVolume = parseFloat(value) / 100;

    setVideoState({
      ...videoState,
      volume: newVolume,
      muted: Number(newVolume) === 0 ? true : false, // volume === 0 then muted
    });
  };

  const volumeSeekUpHandler = (e, value) => {
    const newVolume = parseFloat(value) / 100;

    setVideoState({
      ...videoState,
      volume: newVolume,
      muted: newVolume === 0 ? true : false,
    });
  };

  const muteHandler = () => {
    //Mutes the video player
    setVideoState({ ...videoState, muted: !videoState.muted, volume: videoState.volume <= 0 ? 1 : 0 });
  };

  const onSeekMouseDownHandler = (e) => {
    setVideoState({ ...videoState, seeking: true });
  };

  const mouseMoveHandler = () => {
    // controlRef.current.style.visibility = "visible";
    setShowControlbar(true);
    count.current = 1;
    setVideoState({ ...videoState, showTitle: true })
  };

  const bufferStartHandler = () => {
    // console.log("Bufering.......");
    setVideoState({ ...videoState, buffer: true });
  };

  const bufferEndHandler = () => {
    // console.log("buffering stoped ,,,,,,play");
    setVideoState({ ...videoState, buffer: false });
  };
  // ${isFullScreen ? ' fullscreen' : ''}
  const showQualitesSetting = () => {
    setShowQuality(!showQuality);
    setShowSetting(!showSetting);
  }
  const showPlaybackSetting = () => {
    setshowPlaybackRate(!showPlaybackRate);
    setShowSetting(!showSetting);

  }
  const onChangeQualityLevels = (event) => {
    const internalPlayer = playerRef.current?.getInternalPlayer('hls');
    if (internalPlayer) {
      // currentLevel expects to receive an index of the levels array
      const target = event.target;
      internalPlayer.currentLevel = parseInt(target.dataset.id, 10);
      // console.log(target.dataset.id);
    }
    setShowQuality(!showQuality);
    setSetting(false);
    setShowSetting(false);
  };
  const handleKeyDown = (event) => {
    // You can check for specific key codes or key values here
    switch (event.keyCode) {
      case key.space: {
        event.preventDefault();
        setVideoState({ ...videoState, playing: !videoState.playing })
        break;
      }
      case key.K: {
        // event.preventDefault();
        setVideoState({ ...videoState, playing: !videoState.playing })
        break;
      }

      case key.left: {
        handleRewind(5);
        break;
      }
      case key.right: {
        handleFastFoward(5);
        break;
      }
      case key.J: {
        handleRewind(10);
        break;
      }
      case key.L: {
        handleFastFoward(10);
        break;
      }
      case key.F: {
        handleFullScreen();
        break;
      }
      case key.M: {
        muteHandler();
        break;
      }
      default:
        break;
    }
  };


  return (
    <div className={`video_container`}>
      {
        playing && buffer && (
          <div className={`loadingContainer`}>
            <CircularProgress />
            {/* {buffer && <p>Loading</p>} */}
          </div>
        )
      }

      <Container maxWidth="ld" disableGutters>
        <div
          ref={playerContainerRef}
          className="player_wrapper"
          onMouseMove={mouseMoveHandler}
          tabIndex={0} 
          onFocus={handleFocus} onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        >
          <ReactPlayer
            controls={false}
            ref={playerRef}
            // onDoubleClick={handleDoubleClick}
            url={url}
            // url={`https://www095.vipanicdn.net/streamhls/96ce3697d00eda7a1b385426479d135c/ep.1.1704477243.m3u8`}
            // url={`https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`}
            // url={`https://dl6.webmfiles.org/big-buck-bunny_trailer.webm`}
            width={"100%"}
            height={"100%"}
            className="player"
            playing={playing}
            volume={volume}
            muted={muted}
            pip={pipMode}
            playbackRate={playbackRate}
            onReady={handlePlayerReady}
            onProgress={progressHandler}
            onBuffer={bufferStartHandler}
            onBufferEnd={bufferEndHandler}
            onEnded={handleVideoEnd}
          />

          <Control
            showControlbar={showControlbar}
            onPlayPause={playPauseHandler}
            playing={playing}
            showTitle={showTitle}
            title={title}
            onRewind={handleRewind}
            onForward={handleFastFoward}
            played={played}
            // onSeek={seekHandler}
            onSeekMouseUp={seekMouseUpHandler}
            volume={volume}
            onVolumeChangeHandler={volumeChangeHandler}
            onVolumeSeekUp={volumeSeekUpHandler}
            mute={muted}
            onMute={muteHandler}
            duration={formatDuration}
            currentTime={formatCurrentTime}
            onMouseSeekDown={onSeekMouseDownHandler}
            isFullScreen={isFullScreen}
            handleFullScreen={handleFullScreen}
            pip={pipMode}
            handlePip={handlePip}
            setVSlider={setVSlider}
            vSlider={vSlider}
            showSetting={showSetting}
            setting={setting}
            handleSetting={handleSetting}
            handleMiddleScreenClick={handleMiddleScreenClick}
            showRewindSeekTime={showRewindSeekTime}
            showForwardSeekTime={showForwardSeekTime}
            seekTime={seekTime}
          />
          <div className={`setting_wrapper${setting ? " active" : ""}`}>
            <div className={`quality_wrapper${showQuality ? " active" : ""}`}>
              <li onClick={showQualitesSetting}><span><KeyboardArrowLeft /> Quality</span></li>
              {
                levels && levels.length > 0 ? (
                  levels.map((level, i) => (
                    <li key={i} data-id={i}
                      onClick={onChangeQualityLevels}
                      className={`quality_li${currentQuality === level.height ? " active" : ""}`}
                    > {level.height}P </li>)).reverse()
                )
                  : (
                    <li
                      data-id={currentQuality}
                      onClick={() => {
                        setCurrentQuality(currentQuality);
                        onChangeQualityLevels();
                      }}
                      className={`quality_li active`}
                    >{currentQuality}P</li>
                  )
              }
            </div>
            <div className={`playbackRate_wrapper${showPlaybackRate ? " active" : ""}`}>
              <li onClick={showPlaybackSetting}><span><KeyboardArrowLeft /> Playback Speed</span></li>
              {
                playbackRates.map((rate, i) => (
                  <li data-value={rate} key={i}
                    onClick={setPlaybackRate}
                    className={`playback_li${playbackRate === rate ? " active" : ""}`}
                  >{rate}x</li>
                ))
              }
            </div>
            <div className={`settings${showSetting ? " active" : ""}`}>
              <li onClick={showPlaybackSetting}><span><PlayCircleFilledWhiteOutlined /> Playback Speed</span> <span><p>{playbackRate}x</p> <KeyboardArrowRight /></span></li>
              <li onClick={showQualitesSetting}><span><Tune /> Quality</span> <span><p>{currentQuality}P</p><KeyboardArrowRight /></span></li>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
const formatTime = (time) => {
  //formarting duration of video
  if (isNaN(time)) {
    return "00:00";
  }

  const date = new Date(time * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");
  if (hours) {
    //if video have hours
    return `${hours}:${minutes.toString().padStart(2, "0")} `;
  } else return `${minutes}:${seconds}`;
};
export default VideoPlayer;
