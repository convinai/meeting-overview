/* eslint-disable camelcase */
/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { Select, Tag } from 'antd';
import { getDuration, getMatchRegex } from '../../../utils/helpers';
import config from '../../../utils/meeting.config';
import VideoPlayer from '../../Atoms/VideoPlayer/VideoPlayer';
import Label from '../../Atoms/Label/Label';

const { Option } = Select;

const CallDetails = ({
    playerHandlers,
    playerState,
    playerUX,
    showSpeedContext,
    playedSeconds,
    seeking,
    playerRef,
    setplayedSeconds,
    summary,
    title,
    start_time,
    end_time,
    showUserOptions,
    call_type,
    changeCallType,
    allCallTypes,
    conference_tool,
    client,
    description,
    keywords,
    agenda,
}) => {
    const baseClass = 'individualcall-details-right';

    return (
        <div className={`${baseClass}-calldetails`}>
            <div className={`${baseClass}-calldetails-top`}>
                <VideoPlayer
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...playerHandlers}
                    playerState={playerState}
                    playerUX={playerUX}
                    showSpeedContext={showSpeedContext}
                    playedSeconds={playedSeconds}
                    seeking={seeking}
                    playerRef={playerRef}
                    setplayedSeconds={setplayedSeconds}
                />
                <div className="detailssec row">
                    <div className="detail">
                        <Label label={config.CALLNAME} />
                        <div>{summary || title}</div>
                    </div>
                    <div className="detail">
                        <Label label={config.CALLDURATION} />
                        <div>
                            {(start_time && end_time
                                ? getDuration(
                                    start_time,
                                    end_time,
                                )
                                : '')}
                        </div>
                    </div>
                    <div className="detail novertical">
                        <Label label={config.CALLTYPE} />
                        {!showUserOptions ? (
                            <Tag
                                className="grey"
                            >
                                {call_type
                                    ? call_type.type
                                    : config.NOCALLTYPE}
                            </Tag>
                        ) : (
                            <Select
                                className="completed-call-type"
                                name="call_type"
                                placeholder="-Select Type-"
                                onChange={(value) => {
                                    changeCallType(value);
                                }}
                                value={
                                    call_type
                                        ? call_type.id
                                        : undefined
                                }
                            >
                                <Option disabled>-Select Type-</Option>
                                {allCallTypes.map((category) => (
                                    <Option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.type}
                                    </Option>
                                ))}
                            </Select>
                        )}
                    </div>
                    <div className="detail">
                        <Label label={config.MEDIUM} />
                        <div>{conference_tool}</div>
                    </div>
                </div>
                <div className="detailssec">
                    <div className="detail">
                        <Label label={config.RECEPIENTS} />
                        <div>
                            {client && client.name
                                ? client.name
                                : ''}
                        </div>
                    </div>
                </div>
                <div className="detailssec">
                    <div className="detail">
                        <Label label={config.AGENDA} />
                        {description && keywords.length > 0 ? (
                            <p
                                dangerouslySetInnerHTML={{
                                    __html: description.replace(
                                        getMatchRegex(keywords),
                                        (matched) => `<mark class="cite">${matched}</mark>`,
                                    ),
                                }}
                            />
                        ) : (
                            <p>{description}</p>
                        )}
                        {agenda && keywords.length > 0 ? (
                            <p
                                className="callsCard-middle-agenda-value callsCard-middle-section-value"
                                dangerouslySetInnerHTML={{
                                    __html: agenda.replace(
                                        getMatchRegex(keywords),
                                        (matched) => `<mark class="cite">${matched}</mark>`,
                                    ),
                                }}
                            />
                        ) : (
                            <p className="callsCard-middle-agenda-value callsCard-middle-section-value">
                                {agenda}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

CallDetails.defaultProps = {
    summary: '',
    title: '',
    start_time: '',
    end_time: '',
    changeCallType: () => {},
    allCallTypes: [],
    conference_tool: '',
    keywords: [],
    agenda: '',
    call_type: null,
};

CallDetails.propTypes = {
    playerHandlers: PropTypes.objectOf(PropTypes.func).isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    playerUX: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    playerState: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    playerRef: PropTypes.any.isRequired,
    showSpeedContext: PropTypes.bool.isRequired,
    playedSeconds: PropTypes.number.isRequired,
    seeking: PropTypes.bool.isRequired,
    setplayedSeconds: PropTypes.func.isRequired,
    summary: PropTypes.string,
    title: PropTypes.string,
    start_time: PropTypes.string,
    end_time: PropTypes.string,
    showUserOptions: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    call_type: PropTypes.object,
    changeCallType: PropTypes.func,
    allCallTypes: PropTypes.arrayOf(PropTypes.object),
    conference_tool: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    client: PropTypes.object.isRequired,
    description: PropTypes.string.isRequired,
    keywords: PropTypes.arrayOf(PropTypes.string),
    agenda: PropTypes.string,
};

export default CallDetails;
