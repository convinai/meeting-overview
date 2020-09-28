/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import {
    Empty, Button, Typography, Tooltip, Input, Tag, Spin,
} from 'antd';
import PropTypes from 'prop-types';
import { ClockCircleOutlined, HighlightOutlined, UserOutlined } from '@ant-design/icons';
import { secondsToTime, getRandomColors, scrollElementInView } from '../../../utils/helpers';
import Label from '../../Atoms/Label/Label';
import IndividualCallConfig from '../../../utils/meeting.config';
import Processing from '../Processing/Processing';

const { Paragraph } = Typography;
const { Search } = Input;

const CallTranscript = ({
    callTranscripts,
    isEditingTranscript,
    playedSeconds,
    isProcessing,
    seekToPoint,
    cancelEdit,
    saveEdit,
    handleTurnEditOn,
    highlightTranscript,
    handleEditTranscript,
}) => {
    const baseClass = 'individualcall-transcript';
    const [activeTranscript, setactiveTranscript] = useState(0);
    const [transcripts, setTranscripts] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');

    const filterTranscripts = ((val) => {
        setSearchKeyword(val);
        if (!isEditingTranscript && val) {
            const found = callTranscripts.filter((transcript) => new RegExp(val, 'ig').test(transcript.monologue_text));

            setTranscripts(found);
        } else {
            setTranscripts(callTranscripts);
        }
    });

    const handleActiveTranscript = ((index, time) => {
        if (!isEditingTranscript) {
            scrollElementInView(`[data-index="${index}"]`, 'nearest');
        }
        setactiveTranscript(index);
        if (time) {
            seekToPoint(time, true);
        }
    });

    useEffect(() => {
        setTranscripts(callTranscripts);
        if (!isEditingTranscript && searchKeyword) {
            filterTranscripts(searchKeyword);
        }
    }, [callTranscripts]);

    useEffect(() => {
        const activateIndex = callTranscripts.findIndex(
            (transcript) => playedSeconds >= transcript.start_time
                && playedSeconds <= transcript.end_time,
        );
        handleActiveTranscript(
            activateIndex === -1 ? activeTranscript : activateIndex,
        );
    }, [playedSeconds]);

    return (
        <>
            {isProcessing ? (
                <Processing />
            ) : (
                <>
                    <div className="transcript-action-card">
                        {!isEditingTranscript && (
                            <div className="transcript-search">
                                <Search
                                    value={searchKeyword}
                                    allowClear
                                    placeholder="Search in transcript"
                                    onChange={(e) => filterTranscripts(e.target.value)}
                                />
                                {searchKeyword && (
                                    <span className="results">
                                        {' '}
                                        {transcripts.length}
                                        {' '}
                                        Results
                                    </span>
                                )}
                            </div>
                        )}
                        <div className="actions">
                            {isEditingTranscript ? (
                                <>
                                    <Button
                                        shape="round"
                                        onClick={cancelEdit}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        shape="round"
                                        type="primary"
                                        onClick={saveEdit}
                                    >
                                        Save
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    type="primary"
                                    shape="round"
                                    onClick={handleTurnEditOn}
                                >
                                    Edit
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className={`${baseClass}-container`}>
                        {callTranscripts.length
                        && !transcripts.length
                        && !searchKeyword ? (
                            // eslint-disable-next-line indent
                            <Spin />
                            ) : (
                                <>
                                    {transcripts.length ? (
                                        transcripts.map((transcript, index) => (
                                        // eslint-disable-next-line max-len
                                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                                        // eslint-disable-next-line max-len
                                        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                                            <div
                                                className={`${baseClass} ${
                                                    index === activeTranscript
                                                        ? 'active'
                                                        : ''
                                                }`}
                                                key={transcript.start_time}
                                                data-index={index}
                                                onClick={() => {
                                                    handleActiveTranscript(
                                                        index,
                                                        transcript.start_time,
                                                    );
                                                }}
                                            >
                                                <div className={`${baseClass}-top`}>
                                                    <div
                                                        className={`${baseClass}-top-name`}
                                                    >
                                                        <UserOutlined />
                                                        <Label
                                                            label={
                                                                transcript.speaker_name
                                                            }
                                                        />
                                                        <div className="topics">
                                                            {Object.keys(
                                                                transcript.topics,
                                                            )[0] && (
                                                                <Tag
                                                                    color={getRandomColors(
                                                                        Object.keys(
                                                                            transcript.topics,
                                                                        )[0],
                                                                    )}
                                                                >
                                                                    {
                                                                        Object.keys(
                                                                            transcript.topics,
                                                                        )[0]
                                                                    }
                                                                </Tag>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={`${baseClass}-top-time`}
                                                    >
                                                        {!isEditingTranscript && (
                                                            <div className="highlight">
                                                                <Tooltip
                                                                    destroyTooltipOnHide
                                                                    title="Highlight"
                                                                >
                                                                    <Button
                                                                        icon={
                                                                            <HighlightOutlined />
                                                                        }
                                                                        type="link"
                                                                        onClick={() => {
                                                                            highlightTranscript(
                                                                                transcript,
                                                                            );
                                                                        }}
                                                                    />
                                                                </Tooltip>
                                                            </div>
                                                        )}
                                                        <div className="clock">
                                                            <ClockCircleOutlined />
                                                            {secondsToTime(
                                                                transcript.start_time,
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className={`${baseClass}-bottom`}
                                                >
                                                    <Paragraph
                                                        mark={
                                                            transcript.highlighted
                                                        }
                                                        editable={{
                                                            editing:
                                                            isEditingTranscript,
                                                            onChange: (str) => {
                                                                handleEditTranscript(
                                                                    str,
                                                                    index,
                                                                );
                                                            },
                                                        }}
                                                    >
                                                        {transcript.monologue_text}
                                                    </Paragraph>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <Empty
                                            description={
                                                IndividualCallConfig.NOTRANSCRIPT
                                            }
                                        />
                                    )}
                                </>
                            )}
                    </div>
                </>
            )}
        </>
    );
};

CallTranscript.defaultProps = {
    seekToPoint: () => {},
    cancelEdit: () => {},
    saveEdit: () => {},
    handleTurnEditOn: () => {},
    highlightTranscript: () => {},
    handleEditTranscript: () => {},
};

CallTranscript.propTypes = {
    isProcessing: PropTypes.bool.isRequired,
    seekToPoint: PropTypes.func,
    callTranscripts: PropTypes.arrayOf(PropTypes.object).isRequired,
    isEditingTranscript: PropTypes.bool.isRequired,
    playedSeconds: PropTypes.number.isRequired,
    cancelEdit: PropTypes.func,
    saveEdit: PropTypes.func,
    handleTurnEditOn: PropTypes.func,
    highlightTranscript: PropTypes.func,
    handleEditTranscript: PropTypes.func,
};

export default CallTranscript;
