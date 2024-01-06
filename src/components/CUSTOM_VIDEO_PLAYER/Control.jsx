import React, { useState } from 'react'
import {
    PlayArrow, Pause, FastForward,
    FastRewind, SkipNext, VolumeUp, VolumeOff,
    Settings, PictureInPictureAlt,
    Tune, FullscreenExit, Fullscreen,
    KeyboardArrowRight, KeyboardArrowLeft,
    Crop169, Crop32, PictureInPicture
} from '@mui/icons-material';
import { Slider, makeStyles } from '@mui/material';
import "./Control.css"
const Control = (prop) => {
    const{ 
        onPlayPause,playing, onRewind, onForward, played, onSeek, onSeekMouseUp, onVolumeChangeHandler, 
        onVolumeSeekUp, volume, mute, onMute, duration, currentTime, onMouseSeekDown, handlePip, pip, 
        controlRef, isFullScreen, handleFullScreen, vSlider, setVSlider, setting, handleSetting, 
        handleMiddleScreenClick,title,showTitle,totalSeekedTime}= prop;
    const handleVolumeSlide = () => {
        setVSlider(true);
    };

    return (
        <div className={`control_Container`} ref={controlRef}>
            <div className={`top_container${showTitle?" active":""}`}>
            <h2>{title}</h2>
            </div>
            <div className="mid_container">
                <div className="icon_btn"
                onDoubleClick={onRewind}
                onClick={handleMiddleScreenClick}
                id="rewind">
                <FastRewind fontSize="inherit" />
                </div>
                <div className="icon_btn"
                onClick={onPlayPause}
                id='bigPlay'>
                    {
                        playing ? (
                            <Pause fontSize='inherit' />
                        ) : (
                            <PlayArrow fontSize='inherit' />
                        )
                    }
                </div>
                <div className="icon_btn"
                onDoubleClick={onForward}
                onClick={handleMiddleScreenClick} 
                id="fastForward">
                <FastForward fontSize="inherit" />
                </div>
            </div>
            <div className="bottom_container">

                <div className="slider_container">
                    <Slider
                        className='slider'
                        min={0}
                        max={100}
                        value={played * 100}
                        onChange={onSeek}
                        onChangeCommitted={onSeekMouseUp}
                        onMouseDown={onMouseSeekDown}
                    />
                </div>
                <div className="control_box">
                    <div className="inner_controls">
                        <div className="inner_left">
                            <div className="icon_btn" onClick={onPlayPause}>
                                {
                                    playing ? (
                                        <Pause fontSize='inherit' />
                                    ) : (
                                        <PlayArrow fontSize='inherit' />
                                    )
                                }
                            </div>

                            <div className="icon_btn" id='skipNext'>
                                <SkipNext fontSize="inherit" />
                            </div>

                            <div className="icon_btn"
                                onClick={onMute}
                                onMouseEnter={handleVolumeSlide}
                                onTouchStart={handleVolumeSlide}
                            >
                                {mute ? (
                                    <VolumeOff fontSize="inherit" />
                                ) : (
                                    <VolumeUp fontSize="inherit" />
                                )}
                            </div>
                            <div className={`volume_slider_container${vSlider ? ' active' : ''}`} >
                                <Slider
                                    className={`volume_slider`}
                                    onChange={onVolumeChangeHandler}
                                    value={volume * 100}
                                    onChangeCommitted={onVolumeSeekUp}
                                />
                            </div>
                            <div className="icon_btn">
                                <span id='timer'>{currentTime} / {duration}</span>
                            </div>
                        </div>
                        <div className="inner_right">
                            <div className="icon_btn">
                                <Settings className={`settingIcon${setting ? " active" : ""}`} fontSize='inherit' onClick={handleSetting} />
                            </div>
                            <div className="icon_btn" onClick={handlePip}>
                                {
                                    pip ? (
                                        <PictureInPicture fontSize='inherit' />
                                    ) : (
                                        <PictureInPictureAlt fontSize='inherit' />
                                    )
                                }
                            </div>
                            <div className="icon_btn" id='theater'>
                                <Crop32 fontSize='inherit' />
                            </div>
                            <div className="icon_btn" onClick={handleFullScreen}>
                                {
                                    isFullScreen ? (
                                        <FullscreenExit fontSize='inherit' />
                                    ) : (
                                        <Fullscreen fontSize='inherit' />
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Control
