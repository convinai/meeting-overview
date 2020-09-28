/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useRef, useEffect, useState } from 'react';
import {
    CaretRightOutlined, FullscreenExitOutlined,
    FullscreenOutlined, LoadingOutlined, MoreOutlined,
    NotificationOutlined, PauseOutlined, PlayCircleOutlined,
    SoundOutlined, StopOutlined, SyncOutlined,
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import { Button, Slider, Spin } from 'antd';
import screenfull from 'screenfull';
import config from '../../../utils/meeting.config';
import { secondsToTime } from '../../../utils/helpers';

const VideoPlayer = ({
    toggleSpeedContext,
    playerUX,
    playerRef,
    onReadyHandler,
    getPlayedDuration,
    handleEnd,
    handleBuffer,
    handlePlayerDuration,
    playerState,
    togglePlay,
    playedSeconds,
    setplayedSeconds,
    toggleMute,
    toggleLoop,
    showSpeedContext,
    setplaybackRate,
    seekToPoint,
}) => {
    const contextRef = useRef(null);
    const [isFullScreen, setisFullScreen] = useState(false);

    const checkToCloseContext = (event) => {
        if (contextRef.current && !contextRef.current.contains(event.target)) toggleSpeedContext();
    };

    useEffect(() => {
        document.addEventListener('click', checkToCloseContext);
        return () => document.removeEventListener('click', checkToCloseContext);
    });

    useEffect(() => {
        if (screenfull.isEnabled) {
            screenfull.on('change', () => {
                setisFullScreen(screenfull.isFullscreen);
            });
        }
    }, []);

    const onClickFullscreen = () => {
        screenfull.toggle(document.querySelector('.videocontainer'));
    };

    const antIcon = <LoadingOutlined style={{ fontSize: 32 }} spin />;

    return (
        <div className={`videocontainer ${isFullScreen ? 'fullscreen' : ''}`}>
            <Spin
                indicator={antIcon}
                spinning={
                    playerUX.isBuffering || !playerUX.duration
                }
            >
                <ReactPlayer
                    ref={playerRef}
                    config={{
                        file: {
                            attributes: {
                                preload: 'metadata',
                            },
                        },
                    }}
                    className="player"
                    width="100%"
                    height="87.5%"
                    onReady={onReadyHandler}
                    onProgress={getPlayedDuration}
                    onEnded={handleEnd}
                    onBuffer={() => handleBuffer(true)}
                    onBufferEnd={() => handleBuffer(false)}
                    onDuration={handlePlayerDuration}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...playerState}
                />
                {/* Play Button */}
                <div
                    className={`playbutton ${!playerState.playing ? 'active' : ''
                    }`}
                    onClick={togglePlay}
                >
                    <Button
                        shape="circle"
                        icon={!playerState.playing
                            || playerState.played === 1
                            ? <PlayCircleOutlined /> : ''}
                    />
                </div>
            </Spin>

            {!!playerUX.duration && (
                <>
                    {/* Controls */}
                    <div className="player-controls">
                        <div className="playcontrols">
                            <div className="timeelapsed">
                                {secondsToTime(playedSeconds)}
                            </div>
                            <div
                                className="backwardbutton"
                                title={config.SKIPBACKWARD}
                                onClick={() => {
                                    if (playedSeconds - 10 > 0) {
                                        playerRef.current.seekTo(
                                            parseFloat(playedSeconds - 10),
                                        );
                                        setplayedSeconds(
                                            parseFloat(playedSeconds - 10),
                                        );
                                    } else {
                                        playerRef.current.seekTo(
                                            parseFloat(0),
                                        );
                                        setplayedSeconds(parseFloat(0));
                                    }
                                }}
                            >
                                <svg viewBox="0 0 16 20" version="1.1">
                                    <g
                                        id="Icons"
                                        stroke="none"
                                        strokeWidth="1"
                                        fill="none"
                                        fillRule="evenodd"
                                    >
                                        <g
                                            id="Rounded"
                                            transform="translate(-410.000000, -995.000000)"
                                        >
                                            <g
                                                id="AV"
                                                transform="translate(100.000000, 852.000000)"
                                            >
                                                <g
                                                    id="-Round-/-AV-/-replay_10"
                                                    transform="translate(306.000000, 142.000000)"
                                                >
                                                    <g transform="translate(0.000000, 0.000000)">
                                                        <rect
                                                            id="Rectangle-Copy-56"
                                                            x="0"
                                                            y="0"
                                                            width="24"
                                                            height="24"
                                                        />
                                                        <path
                                                            d="M11.99,5 L11.99,2.21 C11.99,1.76 11.45,1.54 11.14,1.86 L7.35,5.65 C7.15,5.85 7.15,6.16 7.35,6.36 L11.14,10.15 C11.45,10.46 11.99,10.24 11.99,9.8 L11.99,7 C15.72,7 18.67,10.42 17.85,14.29 C17.38,16.56 15.54,18.39 13.28,18.86 C9.71,19.61 6.53,17.16 6.05,13.85 C5.99,13.37 5.57,13 5.07,13 C4.47,13 3.99,13.53 4.07,14.13 C4.69,18.52 8.87,21.77 13.6,20.85 C16.72,20.24 19.23,17.73 19.84,14.61 C20.83,9.48 16.94,5 11.99,5 Z M10.89,16 L10.04,16 L10.04,12.74 L9.03,13.05 L9.03,12.36 L10.8,11.73 L10.89,11.73 L10.89,16 Z M15.17,14.24 C15.17,14.56 15.14,14.84 15.07,15.06 C15,15.28 14.9,15.48 14.78,15.63 C14.66,15.78 14.5,15.89 14.33,15.96 C14.16,16.03 13.96,16.06 13.74,16.06 C13.52,16.06 13.33,16.03 13.15,15.96 C12.97,15.89 12.82,15.78 12.69,15.63 C12.56,15.48 12.46,15.29 12.39,15.06 C12.32,14.83 12.28,14.56 12.28,14.24 L12.28,13.5 C12.28,13.18 12.31,12.9 12.38,12.68 C12.45,12.46 12.55,12.26 12.67,12.11 C12.79,11.96 12.95,11.85 13.12,11.78 C13.29,11.71 13.49,11.68 13.71,11.68 C13.93,11.68 14.12,11.71 14.3,11.78 C14.48,11.85 14.63,11.96 14.76,12.11 C14.89,12.26 14.99,12.45 15.06,12.68 C15.13,12.91 15.17,13.18 15.17,13.5 L15.17,14.24 Z M14.32,13.38 C14.32,13.19 14.31,13.03 14.28,12.9 C14.25,12.77 14.21,12.67 14.16,12.59 C14.11,12.51 14.05,12.45 13.97,12.42 C13.89,12.39 13.81,12.37 13.72,12.37 C13.63,12.37 13.54,12.39 13.47,12.42 C13.4,12.45 13.33,12.51 13.28,12.59 C13.23,12.67 13.19,12.77 13.16,12.9 C13.13,13.03 13.12,13.19 13.12,13.38 L13.12,14.35 C13.12,14.54 13.13,14.7 13.16,14.83 C13.19,14.96 13.23,15.07 13.28,15.15 C13.33,15.23 13.39,15.29 13.47,15.32 C13.55,15.35 13.63,15.37 13.72,15.37 C13.81,15.37 13.9,15.35 13.97,15.32 C14.04,15.29 14.11,15.23 14.16,15.15 C14.21,15.07 14.25,14.96 14.27,14.83 C14.29,14.7 14.31,14.54 14.31,14.35 L14.31,13.38 L14.32,13.38 Z"
                                                            fill="#fff"
                                                        />
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            <div className="playerbutton">
                                <Button
                                    shape="circle"
                                    onClick={togglePlay}
                                    icon={!playerState.playing
                                        || playerState.played === 1
                                        ? <CaretRightOutlined /> : <PauseOutlined />}
                                />
                            </div>
                            <div
                                className="forwardbutton"
                                title={config.SKIPFORWARD}
                                onClick={() => {
                                    if (
                                        (playedSeconds + 10) < playerUX.duration
                                    ) {
                                        playerRef.current.seekTo(
                                            parseFloat(playedSeconds + 10),
                                        );
                                        setplayedSeconds(
                                            parseFloat(playedSeconds + 10),
                                        );
                                    } else {
                                        playerRef.current.seekTo(
                                            parseFloat(playerUX.duration),
                                        );
                                        setplayedSeconds(
                                            parseFloat(playerUX.duration),
                                        );
                                    }
                                }}
                            >
                                <svg viewBox="0 0 16 20" version="1.1">
                                    <g
                                        id="Icons"
                                        stroke="none"
                                        strokeWidth="1"
                                        fill="none"
                                        fillRule="evenodd"
                                    >
                                        <g
                                            id="Rounded"
                                            transform="translate(-784.000000, -908.000000)"
                                        >
                                            <g
                                                id="AV"
                                                transform="translate(100.000000, 852.000000)"
                                            >
                                                <g
                                                    id="-Round-/-AV-/-forward_10"
                                                    transform="translate(680.000000, 54.000000)"
                                                >
                                                    <g>
                                                        <rect
                                                            id="Rectangle-Copy-19"
                                                            x="0"
                                                            y="0"
                                                            width="24"
                                                            height="24"
                                                        />
                                                        <path
                                                            d="M18.92,14 C18.42,14 18.01,14.37 17.94,14.86 C17.46,18.23 14.17,20.7 10.52,19.82 C8.27,19.28 6.61,17.55 6.13,15.29 C5.32,11.42 8.27,8 12,8 L12,10.79 C12,11.24 12.54,11.46 12.85,11.14 L16.64,7.35 C16.84,7.15 16.84,6.84 16.64,6.64 L12.85,2.85 C12.54,2.54 12,2.76 12,3.21 L12,6 C7.06,6 3.16,10.48 4.16,15.6 C4.76,18.71 7.06,21.1 10.15,21.79 C14.98,22.87 19.3,19.59 19.92,15.12 C20.01,14.53 19.52,14 18.92,14 Z M10.9,17 L10.9,12.73 L10.81,12.73 L9.04,13.36 L9.04,14.05 L10.05,13.74 L10.05,17 L10.9,17 Z M14.32,12.78 C14.14,12.71 13.95,12.68 13.73,12.68 C13.51,12.68 13.32,12.71 13.14,12.78 C12.96,12.85 12.81,12.96 12.69,13.11 C12.57,13.26 12.46,13.45 12.4,13.68 C12.34,13.91 12.3,14.18 12.3,14.5 L12.3,15.24 C12.3,15.56 12.34,15.84 12.41,16.06 C12.48,16.28 12.58,16.48 12.71,16.63 C12.84,16.78 12.99,16.89 13.17,16.96 C13.35,17.03 13.54,17.06 13.76,17.06 C13.98,17.06 14.17,17.03 14.35,16.96 C14.53,16.89 14.68,16.78 14.8,16.63 C14.92,16.48 15.02,16.29 15.09,16.06 C15.16,15.83 15.19,15.56 15.19,15.24 L15.19,14.5 C15.19,14.18 15.15,13.9 15.08,13.68 C15.01,13.46 14.91,13.26 14.78,13.11 C14.65,12.96 14.49,12.85 14.32,12.78 Z M14.33,15.35 C14.33,15.54 14.32,15.7 14.29,15.83 C14.26,15.96 14.23,16.07 14.18,16.15 C14.13,16.23 14.07,16.29 13.99,16.32 C13.91,16.35 13.83,16.37 13.74,16.37 C13.65,16.37 13.56,16.35 13.49,16.32 C13.42,16.29 13.35,16.23 13.3,16.15 C13.25,16.07 13.21,15.96 13.18,15.83 C13.15,15.7 13.14,15.54 13.14,15.35 L13.14,14.38 C13.14,14.19 13.15,14.03 13.18,13.9 C13.21,13.77 13.24,13.67 13.3,13.59 C13.36,13.51 13.41,13.45 13.49,13.42 C13.57,13.39 13.65,13.37 13.74,13.37 C13.83,13.37 13.92,13.39 13.99,13.42 C14.06,13.45 14.13,13.51 14.18,13.59 C14.23,13.67 14.27,13.77 14.3,13.9 C14.33,14.03 14.34,14.19 14.34,14.38 L14.34,15.35 L14.33,15.35 Z"
                                                            fill="#fff"
                                                        />
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                        </div>
                        <div className="timeline-container">
                            {playerUX.showClipper ? (
                                <Slider
                                    range
                                    style={{ width: '100%' }}
                                    min={0}
                                    max={playerUX.duration}
                                    value={[
                                        playedSeconds,
                                        playerUX.stopAt,
                                    ]}
                                    // step={1}
                                    onChange={(value) => {
                                        seekToPoint(value, true);
                                    }}
                                    tipFormatter={(value) => secondsToTime(value)}
                                />
                            ) : (
                                <Slider
                                    style={{ width: '100%' }}
                                    min={0}
                                    max={playerUX.duration}
                                    value={playedSeconds}
                                    step={1}
                                    onChange={(value) => seekToPoint(parseFloat(value))}
                                    tipFormatter={(value) => secondsToTime(value)}
                                />
                            )}
                        </div>
                        <div className="otherbuttons">
                            <div className="mutebutton">
                                <Button
                                    shape="circle"
                                    icon={!playerState.muted
                                        ? <SoundOutlined />
                                        : <NotificationOutlined />}
                                    onClick={toggleMute}
                                />
                            </div>
                            <div className="loopoptions">
                                <Button
                                    shape="circle"
                                    icon={!playerState.loop
                                        ? <SyncOutlined />
                                        : <StopOutlined />}
                                    onClick={toggleLoop}
                                />
                            </div>
                            <div className="fullscreen">
                                <Button
                                    shape="circle"
                                    icon={isFullScreen
                                        ? <FullscreenExitOutlined />
                                        : <FullscreenOutlined />}
                                    onClick={onClickFullscreen}
                                />
                            </div>
                            <div className="speedtoggle">
                                <Button
                                    shape="circle"
                                    icon={<MoreOutlined />}
                                    onClick={() => toggleSpeedContext()}
                                />
                                {showSpeedContext && (
                                    <div
                                        className="speedoptions"
                                        ref={contextRef}
                                    >
                                        {config.PLAYRATES.map(
                                            (playRate) => (
                                                <div
                                                    className="speed-option"
                                                    key={playRate}
                                                    onClick={() => setplaybackRate(
                                                        playRate,
                                                    )}
                                                >
                                                    {playRate}
                                                    x
                                                </div>
                                            ),
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

VideoPlayer.defaultProps = {
    onReadyHandler: () => {},
};

VideoPlayer.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    playerUX: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    playerState: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    playerRef: PropTypes.any.isRequired,
    toggleSpeedContext: PropTypes.func.isRequired,
    showSpeedContext: PropTypes.bool.isRequired,
    playedSeconds: PropTypes.number.isRequired,
    seeking: PropTypes.bool.isRequired,
    setplayedSeconds: PropTypes.func.isRequired,
    togglePlay: PropTypes.func.isRequired,
    toggleMute: PropTypes.func.isRequired,
    toggleLoop: PropTypes.func.isRequired,
    setplaybackRate: PropTypes.func.isRequired,
    onReadyHandler: PropTypes.func,
    getPlayedDuration: PropTypes.func.isRequired,
    handleEnd: PropTypes.func.isRequired,
    handleBuffer: PropTypes.func.isRequired,
    handlePlayerDuration: PropTypes.func.isRequired,
    seekToPoint: PropTypes.func.isRequired,
};

export default VideoPlayer;
