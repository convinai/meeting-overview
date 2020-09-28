/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';

import { Badge, Button, Tag } from 'antd';
import config from '../../../utils/meeting.config';
import Processing from '../Processing/Processing';
import Heatmap from '../../Atoms/Heatmap/Heatmap';
import Label from '../../Atoms/Label/Label';

const CallOverview = ({
    callTopics,
    isProcessing,
    monologues,
    callerOverview,
    receiverOverview,
    playedSeconds,
    startAtPoint,
    questions,
    handleTabChange,
}) => {
    const baseClass = 'individualcall-overview';
    const getOccurrence = (value) => callTopics.filter((v) => v.name === value).length;

    const uniqueTopics = callTopics
        && callTopics.filter(
            (topic, index, self) => index === self.findIndex((t) => t.name === topic.name),
        );

    return (
        <>
            {isProcessing ? (
                <Processing />
            ) : (
                <div className={baseClass}>
                    <div className={`${baseClass}-stats`}>
                        {Object.keys(monologues).map((monologue) => {
                            const repName = monologues[monologue][0].name;
                            return (
                                <OverviewHeatMap
                                    key={repName}
                                    monologue={monologues[monologue]}
                                    name={repName}
                                    handleTabChange={handleTabChange}
                                    startAtPoint={startAtPoint}
                                    playedSeconds={playedSeconds}
                                    callerOverview={callerOverview}
                                    questions={questions[repName]}
                                />
                            );
                        })}
                        <div className={`${baseClass}-stats-detailscontainer`}>
                            <div className={`${baseClass}-stats-details`}>
                                <div
                                    className={`${baseClass}-stats-details-topic`}
                                >
                                    <div className="labeller">
                                        <Label label={config.TOPICS} />
                                    </div>
                                    {callTopics.length ? (
                                        <Heatmap
                                            showCommunication={false}
                                            showMessages={false}
                                            showColors
                                            showTimeBars
                                            startAtPoint={startAtPoint}
                                            bars={callTopics}
                                            totalLength={
                                                receiverOverview
                                                    .totalLength
                                            }
                                            playedSeconds={playedSeconds}
                                        />
                                    ) : (
                                        <Label
                                            label={config.NOTOPICS}
                                            labelClass="notopics"
                                        />
                                    )}
                                </div>
                                <div
                                    className={`${baseClass}-stats-details-legends`}
                                >
                                    <div className="detsection">
                                        {uniqueTopics.map((topic) => (
                                            <Button
                                                type="link"
                                                key={topic.name}
                                                onClick={() => startAtPoint(
                                                    topic.startsAt,
                                                    true,
                                                )}
                                            >
                                                <Badge
                                                    color={topic.color}
                                                    text={`${topic.name
                                                    } (${getOccurrence(
                                                        topic.name,
                                                    )})`}
                                                />
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const OverviewHeatMap = ({
    name,
    handleTabChange,
    questions,
    startAtPoint,
    monologue,
    playedSeconds,
    callerOverview,
}) => (
    <div className="individualcall-overview-stats-caller">
        <div className="individualcall-overview-stats-receiver-top">
            <Label labelClass="namelabel" label={name} />
            <Tag
                className="grey"
                onClick={() => handleTabChange(2)}
            >
                {`${questions.questionCount} Questions`}
            </Tag>
        </div>
        <Heatmap
            showCommunication
            showTimeline
            startAtPoint={startAtPoint}
            showTimeBars
            communication={questions.questions}
            bars={monologue}
            playedSeconds={playedSeconds}
            {...callerOverview}
        />
    </div>
);

OverviewHeatMap.propTypes = {
    monologue: PropTypes.objectOf(PropTypes.array).isRequired,
    questions: PropTypes.objectOf(PropTypes.object).isRequired,
    totalLength: PropTypes.number.isRequired,
    playedSeconds: PropTypes.number.isRequired,
    startAtPoint: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    callerOverview: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    handleTabChange: PropTypes.func.isRequired,
};

CallOverview.defaultProps = {
    handleTabChange: () => {},
    startAtPoint: () => {},
};

CallOverview.propTypes = {
    monologues: PropTypes.objectOf(PropTypes.array).isRequired,
    questions: PropTypes.objectOf(PropTypes.object).isRequired,
    playedSeconds: PropTypes.number.isRequired,
    startAtPoint: PropTypes.func,
    // eslint-disable-next-line react/forbid-prop-types
    callerOverview: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    receiverOverview: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    handleTabChange: PropTypes.func,
    callTopics: PropTypes.arrayOf(PropTypes.object).isRequired,
    isProcessing: PropTypes.bool.isRequired,
};

export default CallOverview;
