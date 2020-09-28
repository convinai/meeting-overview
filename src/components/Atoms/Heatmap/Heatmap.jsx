/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
// A Heatmap component that can be used across the app.
import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import { QuestionOutlined, CommentOutlined } from '@ant-design/icons';
import config from '../../../utils/meeting.config';
import { secondsToTime } from '../../../utils/helpers';

const abs = (num) => (num < 0 ? -num : num);

const Heatmap = ({
    showCommunication,
    totalLength,
    communication,
    showTimeBars,
    bars,
    startAtPoint,
    getComment,
    activateContextMenu,
    playedSeconds,
    showTimeline,
}) => {
    const scaleFactor = totalLength / 100; // Seconds per percentage of width of heatmap.
    // const timeStop = props.totalLength / config.MAXTIMESTOPS; // Increment in each time stop.
    const timeStops = [];
    const timeBars = [];

    timeStops.push(0); // Add 00:00 to time stops.

    const renderedCommunication = showCommunication && communication ? (
        <div className="heatmap communicationsec nobg">
            {communication.map((comm) => {
                timeStops.push(comm.time);
                return (
                    <Tooltip
                        destroyTooltipOnHide
                        key={comm.label || comm.text}
                        placement="top"
                        title={comm.label || comm.text}
                    >
                        <div
                            className="communication"
                            style={{
                                marginLeft: `${comm.time / scaleFactor}%`,
                            }}
                            onClick={() => {
                                if (comm.type === config.QUESTIONTYPE) {
                                    if (
                                        startAtPoint
                                            && typeof startAtPoint
                                                === 'function'
                                    ) startAtPoint(comm.time, true);
                                } else if (
                                    comm.type === config.COMMENTTYPE
                                ) {
                                    getComment();
                                } else if (
                                    startAtPoint
                                            && typeof startAtPoint
                                                === 'function'
                                ) startAtPoint(comm.time, true);
                            }}
                        >
                            {
                                comm.type === config.COMMENTTYPE
                                && <CommentOutlined />
                            }
                            {
                                comm.type === config.QUESTIONTYPE
                                && <QuestionOutlined />
                            }
                        </div>
                    </Tooltip>
                );
            })}
        </div>
    ) : (
        ''
    );

    if (showTimeBars) {
        for (let i = 0; i < config.MAXTIMEBARS; i += 1) {
            if (
                (i / config.MAXTIMEBARS) * totalLength
                <= totalLength
            ) {
                timeBars.push(
                    <Tooltip
                        key={i}
                        destroyTooltipOnHide
                        placement="bottom"
                        title={secondsToTime(
                            (i / config.MAXTIMEBARS) * totalLength,
                        )}
                    >
                        <div
                            className="timebar"
                            onContextMenu={(event) => {
                                activateContextMenu(event, (i / config.MAXTIMEBARS) * totalLength);
                            }}
                            style={{
                                marginLeft:
                                    `${i / (config.MAXTIMEBARS / 100)}%`,
                                width: `${1 / (config.MAXTIMEBARS / 100)}%`,
                            }}
                            onClick={() => {
                                if (
                                    startAtPoint
                                    && typeof startAtPoint === 'function'
                                ) {
                                    startAtPoint(
                                        (i / config.MAXTIMEBARS)
                                            * totalLength,
                                        true,
                                    );
                                }
                            }}
                        />
                    </Tooltip>,
                );
            }
        }
    }

    const heatmap = (
        <div className="heatmap">
            {bars
                ? bars.map((bar, index) => (
                    <div
                        className="subdivision"
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        style={{
                            marginLeft: `${bar.startsAt / scaleFactor}%`,
                            width:
                                      `${abs(bar.endsAt - bar.startsAt)
                                          / scaleFactor
                                      }%`,
                            background: bar.color,
                        }}
                    />
                ))
                : ''}
            {showTimeBars ? timeBars : ''}
            <div
                className="player-tracker"
                style={{ marginLeft: `${playedSeconds / scaleFactor}%` }}
            >
                <span className="dropper">
                    <i className="fa fa-caret-up" aria-hidden="true" />
                </span>
            </div>
        </div>
    );

    timeStops.push(totalLength); // Add the end point of the call.

    const timeline = showTimeline ? (
        <div className="heatmap-timeline">
            {timeStops.map((time, index) => {
                const timeToShow = secondsToTime(time);

                // Now we have the hours, minutes and seconds.
                // Just return them.

                return (
                    <div
                        className="timestop"
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        style={{
                            marginLeft: `calc(${time / scaleFactor}% ${
                                index === timeStops.length - 1
                                    ? ' - 1.5rem'
                                    : ' - 0.8rem'
                            })`,
                        }}
                    >
                        {timeToShow}
                    </div>
                );
            })}
        </div>
    ) : (
        ''
    );

    return (
        <div className="heatmap-container">
            {showCommunication ? renderedCommunication : ''}
            {heatmap}
            {timeline}
        </div>
    );
};

Heatmap.defaultProps = {
    getComment: () => {},
    startAtPoint: () => {},
    activateContextMenu: () => {},

};

Heatmap.propTypes = {
    showTimeBars: PropTypes.bool.isRequired,
    showTimeline: PropTypes.bool.isRequired,
    showCommunication: PropTypes.bool.isRequired,
    getComment: PropTypes.func,
    bars: PropTypes.arrayOf(PropTypes.object).isRequired,
    communication: PropTypes.arrayOf(PropTypes.object).isRequired,
    totalLength: PropTypes.number.isRequired,
    playedSeconds: PropTypes.number.isRequired,
    startAtPoint: PropTypes.func,
    activateContextMenu: PropTypes.func,
};

export default Heatmap;
