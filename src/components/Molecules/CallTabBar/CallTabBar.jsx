/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Button } from 'antd';
import {
    CommentOutlined,
    TableOutlined,
    ShareAltOutlined,
} from '@ant-design/icons';
import PropTypes from 'prop-types';

import config from '../../../utils/meeting.config';

const CallTabBar = ({
    tabs,
    activeTabIndex,
    handleTabChange,
    toggleComments,
    isProcessing,
    sharerHandler,
    callId,
    handleShowAddToLib,
    showComments,
    showAddToLibrary,
    showShare,
}) => {
    const tabClass = 'individualcall-tabbar';
    const tabsToShow = tabs.map((tab, index) => (
        <div
            className={`${tabClass}-tabs-tab ${
                index === activeTabIndex ? 'active' : ''
            }`}
            onClick={() => handleTabChange(index)}
            key={tab}
            title={tab}
        >
            <button type="button" className="accessibility">
                <span className={`${tabClass}-tabs-tab-label`}>{tab}</span>
            </button>
            {index === activeTabIndex ? (
                <span className="activeBottom" />
            ) : (
                ''
            )}
        </div>
    ));

    return (
        <div
            className={tabClass}
        >
            <div className={`${tabClass}-tabs`}>{tabsToShow}</div>
            <div className={`${tabClass}-options`}>
                {
                    showComments
                    && (
                        <div
                            className={`${tabClass}-options-option`}
                            title={config.COMMENTS}
                        >
                            <Button
                                type="link"
                                shape="round"
                                icon={<CommentOutlined />}
                                onClick={toggleComments}
                            >
                                {config.COMMENTS}
                            </Button>
                        </div>
                    )
                }
                {
                    showShare
                    && (
                        <div
                            className={`${tabClass}-options-option`}
                            title={config.LISTENLATER}
                        >
                            <Button
                                icon={<ShareAltOutlined />}
                                type="link"
                                shape="round"
                                disabled={isProcessing}
                                onClick={() => {
                                    sharerHandler(callId, true);
                                }}
                            >
                                Share
                            </Button>
                        </div>
                    )
                }
                {
                    showAddToLibrary
                    && (
                        <div
                            className={`${tabClass}-options-option`}
                            title={config.ADDTOLIB}
                        >
                            <Button
                                type="primary"
                                shape="round"
                                icon={<TableOutlined />}
                                onClick={handleShowAddToLib}
                            >
                                {config.ADDTOLIB}
                            </Button>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default CallTabBar;

CallTabBar.defaultProps = {
    toggleComments: () => {},
    sharerHandler: () => {},
    handleShowAddToLib: () => {},
    showComments: false,
    showAddToLibrary: false,
    showShare: false,
};

CallTabBar.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
    activeTabIndex: PropTypes.number.isRequired,
    handleTabChange: PropTypes.func.isRequired,
    toggleComments: PropTypes.func,
    isProcessing: PropTypes.bool.isRequired,
    sharerHandler: PropTypes.func,
    callId: PropTypes.number.isRequired,
    handleShowAddToLib: PropTypes.func,
    showComments: PropTypes.bool,
    showAddToLibrary: PropTypes.bool,
    showShare: PropTypes.bool,
};
