import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import Container from '@mui/material/Container';
import screenfull from 'screenfull';
import CircularProgress from '@mui/material/CircularProgress';

import './VideoPlayer.css';
import Control from './Control';
import {
  KeyboardArrowRight, KeyboardArrowLeft,Tune,PlayCircleFilledWhiteOutlined
} from '@mui/icons-material';
// let count = 0;
const VideoPlayer = ({url}) => {
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlRef = useRef(null);
  const [showQuality, setShowQuality] = useState(false);
  const [showPlaybackRate, setshowPlaybackRate] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const [setting, setSetting]= useState(false);
  const [levels, setLevels] = useState([]);
  const [currentQuality, setCurrentQuality] = useState(0);
  const playbackRates = [0.25, 0.50, 1.0, 1.50, 2.0, 2.50, 3.0]
  const [videoState, setVideoState] = useState({
    playing: false,
    muted: false,
    volume: 0.5,
    playbackRate: 1.0,
    played: 0,
    seeking: false,
    buffer: true,
    isFullScreen:false,
    pipMode:false,
    showTitle:false,
    title:null,
  });
  const count = useRef(0);
  const [vSlider, setVSlider] = useState(false);
  //Destructuring the properties from the videoState
  const { playing, muted, volume, playbackRate, played, seeking, buffer,isFullScreen,pipMode,title,showTitle} =videoState;
  const currentTime = playerRef.current? playerRef.current.getCurrentTime(): "00:00";
  const duration = playerRef.current ? playerRef.current.getDuration() : "00:00";

  const formatCurrentTime = formatTime(currentTime);
  const formatDuration = formatTime(duration);

  const handlePlayerReady = () => {
    const internalPlayer = playerRef.current?.getInternalPlayer('hls');
    if (internalPlayer) {
      setLevels(internalPlayer.levels);
      console.log(internalPlayer.levels);
    }
  };
  const handleSetting = ()=>{
    if(setting && showSetting){
      setSetting(false);
      setShowSetting(false);
    }else{
      setSetting(true);
      setShowSetting(true);
    }
    setShowQuality(false);
    setshowPlaybackRate(false);
}

  // const handlePlaybackRateChange = (e) => {
  //   // setPlaybackRate(parseFloat(e.target.value));
  //   setVideoState({ ...videoState, playbackRate: parseFloat(e.target.value) });

  // };
  const setPlaybackRate = (event)=>{
    const target = event.target;
    // console.log(rate);
    // setVideoState({...videoState, playbackRate: rate});
    setVideoState({ ...videoState, playbackRate: parseFloat(target.dataset.value) });
    setSetting(false);
    setShowSetting(false);
    setshowPlaybackRate(false);

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
          screen.orientation?.lock('landscape')?.catch(error => {
            console.error('Unable to lock screen orientation:', error);
          });
        }
      } else {
        // Exiting fullscreen
        screenfull.exit();
        // Check if screen.orientation.unlock is supported before using it
        screen.orientation?.unlock?.();
      }
  
      setVideoState({ ...videoState, isFullScreen: !videoState.isFullScreen });
    }
  };
  
  const rewindHandler = () => {
    //Rewinds the video player reducing 5
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 5);
  };

  const handleFastFoward = () => {
    //FastFowards the video player by adding 10
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  };
  const progressHandler = (state) => {
    if (count.current > 2) {
      // console.log("close");
      
      setSetting(false);
      setShowQuality(false);
      setShowSetting(false);
      setshowPlaybackRate(false);
      setVSlider(false);
      setVideoState({...videoState, showTitle:false})
      controlRef.current.style.visibility = "hidden"; // toggling player control container
    } else if (controlRef.current.style.visibility === "visible") {
      count.current += 1;
    }

    if (!seeking) {
      setVideoState({ ...videoState, ...state });
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

  };
  const handleMiddleScreenClick =()=>{
    setting && setSetting(false);
    showQuality && setShowQuality(false);
    showSetting && setShowSetting(false);
    showPlaybackRate && setshowPlaybackRate(false);
    vSlider && setVSlider(false);
    controlRef.current.style.visibility = "hidden"; // toggling player control container
  }

  const seekHandler = (e, value) => {
    setVideoState({ ...videoState, played: parseFloat(value / 100) });
    playerRef.current.seekTo(parseFloat(value / 100));
  };

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
    setVideoState({ ...videoState, muted: !videoState.muted, volume: videoState.volume <=0?1:0 });
  };

  const onSeekMouseDownHandler = (e) => {
    setVideoState({ ...videoState, seeking: true });
  };

  const mouseMoveHandler = () => {
    controlRef.current.style.visibility = "visible";
    count.current = 0;
    setVideoState({...videoState, showTitle:true})
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
  const showQualitesSetting = ()=>{
    setShowQuality(!showQuality);
    setShowSetting(!showSetting);
  }
  const showPlaybackSetting = ()=>{
    setshowPlaybackRate(!showPlaybackRate);
    setShowSetting(!showSetting);
    
  }
  const onChangeBitrate = (event) => {
    const internalPlayer = playerRef.current?.getInternalPlayer('hls');
    if (internalPlayer) {
      // currentLevel expects to receive an index of the levels array
      const target = event.target;
      internalPlayer.currentLevel = parseInt(target.dataset.id, 10);
      // console.log(target.dataset.id);
      setShowQuality(!showQuality);
      setSetting(false);
      setShowSetting(false);
    }
  };
  const [totalSeekedTime, setTotalSeekedTime] = useState(0);
  const [doubleClickCount, setDoubleClickCount] = useState(0);

  const handleDoubleClick = (e) => {
    // Check if the event occurred within a short time interval
    if (e.timeStamp - (doubleClickCount > 0 ? doubleClickCount[doubleClickCount.length - 1] : 0) < 300) {
      // Double-click detected
      const currentTime = e.target.currentTime;
      setTotalSeekedTime((prevTotalSeekedTime) => prevTotalSeekedTime + currentTime);
    }

    // Update double click count with the current timestamp
    setDoubleClickCount((prevClicks) => [...prevClicks, e.timeStamp]);
  };

  return (
    <div className={`video_container`}>
      {
        playing && buffer &&(
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
        >
          <ReactPlayer
            controls={false}
            ref={playerRef}
            // onDoubleClick={handleDoubleClick}
            url={url}
            // url={`https://www095.vipanicdn.net/streamhls/96ce3697d00eda7a1b385426479d135c/ep.1.1704477243.m3u8`}
            // url={`https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`}
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
          />

        <Control 
          controlRef={controlRef}
          onPlayPause={playPauseHandler}
          playing={playing}
          showTitle={showTitle}
          title={title}
          onRewind={rewindHandler}
          onForward={handleFastFoward}
          played={played}
          onSeek={seekHandler}
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
          totalSeekedTime={totalSeekedTime}
        />
        <div className={`setting_wrapper${setting?" active":""}`}>
          <div className={`quality_wrapper${showQuality?" active":""}`}>
            <li onClick={showQualitesSetting}><span><KeyboardArrowLeft /> Quality</span></li>
            {/* <li>1080P</li> */}
            {levels.map((level, i) => ( 
            <li key={i} data-id={i} 
            onClick={onChangeBitrate}
            className={`quality_li${currentQuality === level.height? " active":""}`}
            > {level.height}P </li>)).reverse()}
          </div>
          <div className={`playbackRate_wrapper${showPlaybackRate?" active": ""}`}>
          <li onClick={showPlaybackSetting}><span><KeyboardArrowLeft /> Playback Speed</span></li>
            {
              playbackRates.map((rate,i)=>(
                <li data-value={rate} key={i}
                onClick={setPlaybackRate}
                className={`playback_li${playbackRate === rate?" active":""}`}
                >{rate}x</li>
              ))
            }
          </div>
          <div className={`settings${showSetting?" active":""}`}>
          <li onClick={showPlaybackSetting}><span><PlayCircleFilledWhiteOutlined/> Playback Speed</span> <span><p>{playbackRate}x</p> <KeyboardArrowRight /></span></li>
          <li onClick={showQualitesSetting}><span><Tune/> Quality</span> <span><p>{currentQuality}P</p><KeyboardArrowRight /></span></li>
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
