import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Icon.css';

const icon = (props) => {
  if (props.active) props.classNames.push('Active');
  return <FontAwesomeIcon className={props.classNames.join(' ')} icon={props.icon} onClick={props.onClick} />;
};

icon.propTypes = {
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  classNames: PropTypes.arrayOf(PropTypes.string),
  active: PropTypes.bool,
};

icon.defaultProps = {
  onClick: () => {},
  classNames: [],
  active: false,
};

export default icon;
