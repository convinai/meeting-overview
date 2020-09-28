/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import { getRandomColors, isEmpty, getDurationInSeconds } from '../../../utils/helpers';
import { instance } from '../../../Apis/instance';
import {
    getMeetingById,
    getCallTranscript,
    updateCallTranscript,
    getCallMedia,
} from '../../../Apis/makeApiCalls';
import meetingConfig from '../../../utils/meeting.config';
import CallTabBar from '../../Molecules/CallTabBar/CallTabBar';
import CallStatistics from '../../Molecules/CallStatistics/CallStatistics';
import CallQuestions from '../../Molecules/CallQuestions/CallQuestions';
import CallActionItems from '../../Molecules/CallActionItems/CallActionItems';
import CallTranscript from '../../Molecules/CallTranscript/CallTranscript';
import CallDetails from '../../Molecules/CallDetails/CallDetails';
import CallOverview from '../../Molecules/CallOverview/CallOverview';

export default function MeetingOverview({ hostname, jwt, callId }) {
    const tabs = [
        meetingConfig.CALLOVERVIEW,
        meetingConfig.STATISTICS,
        meetingConfig.QUESTIONS,
        meetingConfig.ACTIONITEMS,
        meetingConfig.RAWTRANSCRIPT,
    ];

    // Global state
    const [callDetails, setCallDetails] = useState({});
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);

    // Call Overview states
    const [callerOverview, setCallerOverview] = useState({});
    const [receiverOverview, setReceiverOverview] = useState({});

    // Transcript related states
    const [transcripts, setTranscripts] = useState([]);
    const [questions, setQuestions] = useState({});
    const [monologues, setMonologues] = useState({});
    const [actionItems, setActionItems] = useState({});
    const [callTopics, setCallTopics] = useState([]);
    const [renderedTranscript, setRenderedTranscript] = useState([]);
    const [isEditingTranscript, setisEditingTranscript] = useState(false);
    const [editedTranscript, seteditedTranscript] = useState([]);

    // Call Details
    const [callType, setCallType] = useState({});
    const [showUserOptions, setShowUserOptions] = useState(false);

    // Player States
    const playerRef = useRef(null);
    const [playerState, setplayerState] = React.useState({
        url: '',
        playing: false,
        playbackRate: 1,
        played: 0,
        duration: 0,
        controls: false,
        muted: false,
        volume: 1,
        loop: false,
    });
    const [playerUX, setplayerUX] = useState({
        isBuffering: false,
        showClipper: false,
        duration: 0,
        stopAt: 0,
    });
    const [playedSeconds, setplayedSeconds] = useState(0);
    const [showSpeedContext, setshowSpeedContext] = useState(false);
    const [seeking, setseeking] = useState(false);

    const tabHandlers = {
        handleTabChange: (tabIndex) => setActiveTab(tabIndex),
    };

    const transcriptHandlers = {
        handleTurnEditOn: () => {
            seteditedTranscript(transcripts);
            setisEditingTranscript(true);
            setTimeout(() => {
                document.querySelector('.individualcall-transcript:first-of-type textarea.ant-input')
                    .focus();
            }, 0);
        },
        handleEditTranscript: (transcript, idx) => {
            const updatedTranscript = [...editedTranscript];
            updatedTranscript[idx] = {
                ...updatedTranscript[idx],
                monologue_text: transcript,
            };
            seteditedTranscript(updatedTranscript);
        },
        saveEdit: () => {
            setTranscripts(editedTranscript);
            setisEditingTranscript(false);
            transcriptHandlers.updateRenderedTranscript(editedTranscript);
            updateCallTranscript(callId, {
                transcript_json: editedTranscript,
                is_processable: true,
            });
        },
        cancelEdit: () => {
            setisEditingTranscript(false);
        },
        highlightTranscript: (monologue) => {
            const updatedTranscript = [...transcripts];
            // eslint-disable-next-line array-callback-return
            monologue.indexes.map((idx) => {
                updatedTranscript[idx] = {
                    ...updatedTranscript[idx],
                    highlighted: !updatedTranscript[idx].highlighted,
                };
            });
            setTranscripts(updatedTranscript);

            // Call API to update transcript
            updateCallTranscript(callId, {
                transcript_json: updatedTranscript,
                is_processable: false,
            });
            transcriptHandlers.updateRenderedTranscript(updatedTranscript);
        },
        updateRenderedTranscript: (callTranscripts) => {
            /** club repeated speaker type */
            let prevTranscript = null;
            const reducedTranscript = [];
            if (callTranscripts && callTranscripts.length) {
                for (let i = 0; i < callTranscripts.length; i++) {
                    if (prevTranscript) {
                        // if speaker name and first topic is same and total block time is
                        // less then a threshold then merge
                        if (
                            callTranscripts[i]
                            && prevTranscript.speaker_name
                            === callTranscripts[i].speaker_name
                            && ((isEmpty(prevTranscript.topics)
                                && isEmpty(callTranscripts[i].topics))
                                || Object.keys(prevTranscript.topics)[0]
                                === Object.keys(callTranscripts[i].topics)[0])
                            && prevTranscript.totalTime
                            + ((callTranscripts[i].end_time - callTranscripts[i].start_time)
                                < meetingConfig.MERGE_THRESHOLD)
                        ) {
                            prevTranscript.monologue_text += ` ${callTranscripts[i].monologue_text}`;
                            prevTranscript.topics = {
                                ...prevTranscript.topics,
                                ...callTranscripts[i].topics,
                            };
                            prevTranscript.end_time = callTranscripts[i].end_time;
                            prevTranscript.totalTime
                                += callTranscripts[i].end_time
                                - callTranscripts[i].start_time;
                        } else {
                            reducedTranscript.push(prevTranscript);
                            prevTranscript = {
                                ...callTranscripts[i],
                                totalTime:
                                    callTranscripts[i].end_time
                                    - callTranscripts[i].start_time,
                            };
                        }
                        if (prevTranscript.indexes) {
                            prevTranscript.indexes.push(i);
                        } else {
                            prevTranscript.indexes = [i];
                        }
                    } else {
                        prevTranscript = {
                            ...callTranscripts[i],
                            totalTime:
                                callTranscripts[i].end_time
                                - callTranscripts[i].start_time,
                        };
                        if (prevTranscript.indexes) {
                            prevTranscript.indexes.push(i);
                        } else {
                            prevTranscript.indexes = [i];
                        }
                    }
                }
            }
            setRenderedTranscript(reducedTranscript);
        },
        processTranscript: (callTranscripts) => {
            setTranscripts(callTranscripts);
            transcriptHandlers.updateRenderedTranscript(callTranscripts);
            if (callTranscripts.length) {
                const transQuestions = {};
                const transActions = {};
                const transTopics = [];
                const transMonologues = {};
                const prevActionItem = null;

                callTranscripts.forEach((transcript) => {
                    if (!transQuestions[transcript.speaker_name]) {
                        transQuestions[transcript.speaker_name] = {
                            questionCount: 0,
                            questions: [],
                        };
                    }
                    if (!transActions[transcript.speaker_name]) {
                        transActions[transcript.speaker_name] = [];
                    }
                    if (!transMonologues[transcript.speaker_name]) {
                        transMonologues[transcript.speaker_name] = [];
                    }

                    // Extract Monologues for all speakers
                    transMonologues[transcript.speaker_name].push({
                        startsAt: transcript.start_time,
                        endsAt: transcript.end_time,
                        color: getRandomColors(transcript.speaker_name),
                        name: transcript.speaker_name,
                    });

                    // Extract all questions for all speakers
                    if (transcript.sentence_categories.question) {
                        transcript.sentence_categories.question.forEach(
                            (question) => {
                                if (question.text.split(' ').length > 3) {
                                    // Increment question count
                                    transQuestions[
                                        transcript.speaker_name
                                    ].questionCount += 1;

                                    // Add question
                                    transQuestions[
                                        transcript.speaker_name
                                    ].questions.push({
                                        name: transcript.speaker_name,
                                        time: question.start_time || 0,
                                        text: question.text,
                                        type: meetingConfig.QUESTIONTYPE,
                                    });
                                }
                            },
                        );
                    }

                    // Extract Actions
                    if (transcript.sentence_categories.action) {
                        transcript.sentence_categories.action.forEach(
                            (action) => {
                                transActions[transcript.speaker_name].push({
                                    name: transcript.speaker_name,
                                    time: action.start_time || 0,
                                    text: action.text,
                                });
                            },
                        );
                    }

                    // Extract Topics
                    if (Object.keys(transcript.topics).length) {
                        const topic = Object.keys(transcript.topics)[0];
                        transTopics.push({
                            name: topic,
                            startsAt: transcript.start_time,
                            endsAt: transcript.end_time,
                            color: getRandomColors(topic),
                        });
                    }
                });

                // Add final action Item left after merging
                if (prevActionItem) {
                    transActions[prevActionItem.name].push(prevActionItem);
                }

                setQuestions(transQuestions);
                setActionItems(transActions);
                setCallTopics(transTopics);
                setMonologues(transMonologues);
            }
        },
    };

    const miscPageHandlers = {
        changeCallType: (callTypeId = 0) => {
            // if (callTypeId) {
            //     changeCompletedCallType(
            //         domain,
            //         callId,
            //         callTypeId
            //     ).then((res) => setcall_type(res.call_type));
            // }
        },
    };

    const playerHandlers = {
        // eslint-disable-next-line no-shadow
        getPlayerMedia: (callId) => {
            setplayerState({
                ...playerState,
                url: getCallMedia(callId),
            });
        },
        togglePlay: () => setplayerState({ ...playerState, playing: !playerState.playing }),
        seekToPoint: (time, seeknplay) => {
            if (playerRef.current) {
                // eslint-disable-next-line no-param-reassign
                time = Math.floor(time);
                playerRef.current.seekTo(time);
                setplayedSeconds(time);
                if (seeknplay) {
                    setplayerState({ ...playerState, playing: true });
                }
            }
        },
        getPlayedDuration: (duration) => {
            if (!seeking) {
                setplayerState({
                    ...playerState,
                    played: duration.played,
                });
                setplayedSeconds(duration.playedSeconds);
            }
        },
        setplaybackRate: (playbackRate = 1) => {
            setplayerState({ ...playerState, playbackRate });
            setshowSpeedContext(false);
        },
        handleBuffer: (status) => {
            setplayerUX({
                ...playerUX,
                isBuffering: status,
            });
        },
        toggleMute: () => setplayerState({ ...playerState, muted: !playerState.muted }),
        toggleSpeedContext: () => setshowSpeedContext(!showSpeedContext),
        toggleLoop: () => setplayerState({ ...playerState, loop: !playerState.loop }),
        handleEnd: () => setplayerState({ ...playerState, playing: playerState.loop }),
        toggleSeek: () => setseeking(!seeking),
        handlePlayerDuration: (value) => {
            setplayerUX({
                ...playerUX,
                duration: value,
                stopAt: value,
            });
        },
        handleStopAt: (value) => {
            setplayerUX({
                ...playerUX,
                stopAt: value,
            });
        },
    };

    useEffect(() => {
        document.querySelector('body').classList.add('my-calls');
        if (hostname) {
            instance.defaults.baseURL = hostname.startsWith('https://') || hostname.startsWith('http://') ? hostname : `https://${hostname}`;
        }
        instance.defaults.headers.common.Authorization = jwt || '';

        if (hostname && callId) {
            getMeetingById(callId)
                .then((res) => {
                    setLoading(false);
                    if (!res.status) {
                        setCallDetails(res);
                        setCallType(res.call_type);
                        playerHandlers.getPlayerMedia(callId);
                    }
                });

            getCallTranscript(callId)
                .then((res) => {
                    setLoading(false);
                    if (!res.status) {
                        transcriptHandlers.processTranscript(res);
                    }
                });
        }

        return () => {
            document.querySelector('body').classList.remove('my-calls');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hostname, jwt, callId]);
    useEffect(() => {
        // Make an API Call to get the Caller Overview.
        setCallerOverview({
            recpName: callDetails.owner && callDetails.owner.first_name,
            totalLength: getDurationInSeconds(
                callDetails.start_time,
                callDetails.end_time,
            ),
            mainLabel: `${
                callDetails.stats && callDetails.stats.owner_question_count
            } Questions`,
            talkratio: `${
                callDetails.stats
                && (callDetails.stats.owner_talk_ratio * 100).toFixed(2)
            } %`,
        });

        // Make an API Call to get the Receiver Overview.
        setReceiverOverview({
            recpName:
                callDetails.client
                && (callDetails.client.name || callDetails.client.email),
            totalLength: getDurationInSeconds(
                callDetails.start_time,
                callDetails.end_time,
            ),
            mainLabel: `${
                callDetails.stats && callDetails.stats.client_question_count
            } Questions`,
            talkratio: `${
                callDetails.stats
                && (callDetails.stats.client_talk_ratio * 100).toFixed(2)
            } %`,
        });
    }, [callDetails]);

    return (
        <div className="individualcall">
            <Spin spinning={loading}>
                <div className="individualcall-container">
                    <CallTabBar
                        tabs={tabs}
                        activeTabIndex={activeTab}
                        handleTabChange={tabHandlers.handleTabChange}
                        callId={callId}
                        isProcessing={
                            callDetails.transcript === null
                        }
                    />
                    <div className="individualcall-details">
                        <div className="individualcall-details-left">
                            {tabs[activeTab] === meetingConfig.CALLOVERVIEW && (
                                /* Add the Call Overview Section here. */
                                <CallOverview
                                    callerOverview={callerOverview}
                                    receiverOverview={receiverOverview}
                                    startAtPoint={playerHandlers.seekToPoint}
                                    playedSeconds={playedSeconds}
                                    questions={questions}
                                    callTopics={callTopics}
                                    monologues={monologues}
                                    handleTabChange={
                                        tabHandlers.handleTabChange
                                    }
                                    isProcessing={callDetails.transcript === null}
                                />
                            )}
                            {
                                tabs[activeTab] === meetingConfig.STATISTICS
                                && (
                                    <CallStatistics
                                        // eslint-disable-next-line react/jsx-props-no-spreading
                                        {...callDetails.stats}
                                        isProcessing={callDetails.transcript === null}
                                    />
                                )
                            }
                            {
                                tabs[activeTab] === meetingConfig.QUESTIONS
                                && (
                                    <CallQuestions
                                        questions={questions}
                                        seekToPoint={playerHandlers.seekToPoint}
                                        isProcessing={callDetails.transcript === null}
                                    />
                                )
                            }
                            {tabs[activeTab] === meetingConfig.ACTIONITEMS && (
                                // Add the Action Items Section here.
                                <CallActionItems
                                    actionItems={actionItems}
                                    seekToPoint={playerHandlers.seekToPoint}
                                    isProcessing={callDetails.transcript === null}
                                />
                            )}
                            {tabs[activeTab] === meetingConfig.RAWTRANSCRIPT && (
                                // Add the Raw Transcript Section here.
                                <CallTranscript
                                    // eslint-disable-next-line react/jsx-props-no-spreading
                                    {...transcriptHandlers}
                                    callTranscripts={
                                        isEditingTranscript
                                            ? editedTranscript
                                            : renderedTranscript
                                    }
                                    seekToPoint={playerHandlers.seekToPoint}
                                    // keywords={props.activeCall.searchKeyWords}
                                    isEditingTranscript={isEditingTranscript}
                                    playedSeconds={playedSeconds}
                                    isProcessing={callDetails.transcript === null}
                                />
                            )}
                        </div>
                        <div className="individualcall-details-right">
                            <CallDetails
                                // eslint-disable-next-line react/jsx-props-no-spreading
                                {...callDetails}
                                tags={[]}
                                allCallTypes={[]}
                                call_type={callType}
                                showUserOptions={showUserOptions}
                                changeCallType={miscPageHandlers.changeCallType}
                                // Player Handlers
                                playerState={playerState}
                                playerUX={playerUX}
                                playerHandlers={playerHandlers}
                                playedSeconds={playedSeconds}
                                showSpeedContext={showSpeedContext}
                                setplayedSeconds={setplayedSeconds}
                                seeking={seeking}
                                playerRef={playerRef}
                            />
                        </div>
                    </div>
                </div>
            </Spin>
        </div>
    );
}

MeetingOverview.propTypes = {
    hostname: PropTypes.string.isRequired,
    jwt: PropTypes.string.isRequired,
    callId: PropTypes.number.isRequired,
};
