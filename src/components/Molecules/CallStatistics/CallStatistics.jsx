/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import Label from '../../Atoms/Label/Label';
import config from '../../../utils/meeting.config';
import Processing from '../Processing/Processing';

const CallStatistics = ({
    isProcessing,
    owner_talk_ratio,
    longest_monologue_client,
    longest_monologue_owner,
    interactivity,
    patience,
    owner_question_count,
}) => {
    const baseClass = 'individualcall-statistics';

    return (
        <>
            {isProcessing ? (
                <Processing />
            ) : (
                <div className={`${baseClass}`}>
                    <div className={`${baseClass}-stat`}>
                        <Label label={config.TALKRATIO} />
                        <div className={`${baseClass}-stat-value`}>
                            {(owner_talk_ratio * 100).toFixed(2)}
                            {' '}
                            %
                        </div>
                    </div>
                    <div className={`${baseClass}-stat`}>
                        <Label label={config.LONGESTMONO} />
                        <div className={`${baseClass}-stat-value`}>
                            {(
                                parseFloat(longest_monologue_owner) / 60
                            ).toFixed(2)}
                            {config.STATS_UNIT}
                        </div>
                    </div>
                    <div className={`${baseClass}-stat`}>
                        <Label label={config.LONGESTSTORY} />
                        <div className={`${baseClass}-stat-value`}>
                            {(
                                parseFloat(longest_monologue_client) / 60
                            ).toFixed(2)}
                            {config.STATS_UNIT}
                        </div>
                    </div>
                    <div className={`${baseClass}-stat`}>
                        <Label label={config.INTERACTIVITY} />
                        <div className={`${baseClass}-stat-value`}>
                            {(interactivity * 10).toFixed(2)}
                        </div>
                    </div>
                    <div className={`${baseClass}-stat`}>
                        <Label label={config.PATIENCE} />
                        <div className={`${baseClass}-stat-value`}>
                            {patience.toFixed(2)}
                            {' '}
                            SEC
                        </div>
                    </div>
                    <div className={`${baseClass}-stat`}>
                        <Label label={config.QUESTION_RATE} />
                        <div className={`${baseClass}-stat-value`}>
                            {owner_question_count}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

CallStatistics.propTypes = {
    isProcessing: PropTypes.bool.isRequired,
    owner_talk_ratio: PropTypes.number.isRequired,
    longest_monologue_client: PropTypes.number.isRequired,
    longest_monologue_owner: PropTypes.number.isRequired,
    interactivity: PropTypes.number.isRequired,
    patience: PropTypes.number.isRequired,
    owner_question_count: PropTypes.number.isRequired,
};

export default CallStatistics;
