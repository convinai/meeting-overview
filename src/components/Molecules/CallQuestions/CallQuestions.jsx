/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { Empty, Radio } from 'antd';
import PropTypes from 'prop-types';
import { ClockCircleOutlined } from '@ant-design/icons';
import config from '../../../utils/meeting.config';
import Processing from '../Processing/Processing';
import Label from '../../Atoms/Label/Label';
import { secondsToTime } from '../../../utils/helpers';

const CallQuestions = ({ questions, isProcessing, seekToPoint }) => {
    const baseClass = 'individualcall-question';
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [activeQuestionType, setActiveQuestionType] = useState(
        Object.keys(questions)[0],
    );

    return (
        <>
            {isProcessing ? (
                <Processing />
            ) : (
                <div className={`${baseClass}-container`}>
                    {questions && (
                        <div className="row togglers">
                            <div className="col-24">
                                <Label label={config.ASKEDBYLABEL} />
                                <Radio.Group
                                    onChange={(e) => setActiveQuestionType(e.target.value)}
                                    defaultValue={activeQuestionType}
                                >
                                    {Object.keys(questions).map(
                                        (question) => (
                                            <Radio.Button
                                                key={question}
                                                value={question}
                                            >
                                                {question}
                                            </Radio.Button>
                                        ),
                                    )}
                                </Radio.Group>
                            </div>
                        </div>
                    )}
                    {questions
                    && questions[activeQuestionType].questions.length ? (
                            questions[activeQuestionType].questions.map(
                                (question, index) => (
                                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                                    <div
                                        className={`${baseClass} ${
                                            index === activeQuestionIndex
                                                ? 'active'
                                                : ''
                                        }`}
                                        key={question.time}
                                        onClick={() => {
                                            setActiveQuestionIndex(index);
                                            seekToPoint(question.time, true);
                                        }}
                                    >
                                        <div className={`${baseClass}-top`}>
                                            <div
                                                className={`${baseClass}-top-name`}
                                            >
                                                {`" ${question.text} "`}
                                            </div>
                                            <div
                                                className={`${baseClass}-top-time`}
                                            >
                                                <ClockCircleOutlined />
                                                {secondsToTime(question.time)}
                                            </div>
                                        </div>
                                    </div>
                                ),
                            )
                        ) : (
                            <Empty description="No Questions found" />
                        )}
                </div>
            )}
        </>
    );
};

CallQuestions.defaultProps = {
    seekToPoint: () => {},
};

CallQuestions.propTypes = {
    isProcessing: PropTypes.bool.isRequired,
    questions: PropTypes.objectOf(PropTypes.object).isRequired,
    seekToPoint: PropTypes.func,
};

export default CallQuestions;
