/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { Radio, Empty } from 'antd';
import PropTypes from 'prop-types';
import { ClockCircleOutlined } from '@ant-design/icons';
import Label from '../../Atoms/Label/Label';
import config from '../../../utils/meeting.config';
import { secondsToTime } from '../../../utils/helpers';
import Processing from '../Processing/Processing';

const CallActionItems = ({ actionItems, seekToPoint, isProcessing }) => {
    const baseClass = 'individualcall-actionitem';
    const [activeActionIndex, setActiveActionIndex] = useState(0);
    const [activeActionType, setActiveActionType] = useState(
        Object.keys(actionItems)[0],
    );

    return (
        <>
            {isProcessing ? (
                <Processing />
            ) : (
                <div className={`${baseClass}-container`}>
                    {actionItems && (
                        <div className="row togglers">
                            <div className="col-24">
                                <Label label={config.SAIDBY} />
                                <Radio.Group
                                    onChange={(e) => setActiveActionType(e.target.value)}
                                    defaultValue={activeActionType}
                                >
                                    {Object.keys(actionItems).map(
                                        (actionItem) => (
                                            <Radio.Button
                                                key={actionItem}
                                                value={actionItem}
                                            >
                                                {actionItem}
                                            </Radio.Button>
                                        ),
                                    )}
                                </Radio.Group>
                            </div>
                        </div>
                    )}
                    {actionItems
                    && actionItems[activeActionType].length ? (
                            actionItems[activeActionType].map(
                                (action, index) => (
                                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                                    <div
                                        className={`${baseClass} ${
                                            index === activeActionIndex
                                                ? 'active'
                                                : ''
                                        }`}
                                        key={action.text}
                                        onClick={() => {
                                            setActiveActionIndex(index);
                                            seekToPoint(action.time, true);
                                        }}
                                    >
                                        <div className={`${baseClass}-top`}>
                                            <div
                                                className={`${baseClass}-top-name`}
                                            >
                                                {`" ${action.text} "`}
                                            </div>
                                            <div
                                                className={`${baseClass}-top-time`}
                                            >
                                                <ClockCircleOutlined />
                                                {secondsToTime(action.time)}
                                            </div>
                                        </div>
                                    </div>
                                ),
                            )
                        ) : (
                            <Empty description="No Action Items found" />
                        )}
                </div>
            )}
        </>
    );
};

CallActionItems.defaultProps = {
    seekToPoint: () => {},
};

CallActionItems.propTypes = {
    isProcessing: PropTypes.bool.isRequired,
    actionItems: PropTypes.objectOf(PropTypes.array).isRequired,
    seekToPoint: PropTypes.func,
};

export default CallActionItems;
