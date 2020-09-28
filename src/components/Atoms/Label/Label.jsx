import React from 'react';
import PropTypes from 'prop-types';

export default function Label({ labelClass, label }) {
    return (
        // eslint-disable-next-line jsx-a11y/label-has-associated-control
        <label
            className={labelClass ? `label ${labelClass}` : 'label'}
        >
            {label}
        </label>
    );
}

Label.defaultProps = {
    labelClass: '',
};

Label.propTypes = {
    labelClass: PropTypes.string,
    label: PropTypes.string.isRequired,
};
