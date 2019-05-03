import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

/* eslint-disable react/button-has-type */
const button = props => (
  <button
    type={props.btnType}
    className={['Button'].concat(props.btnClassNames).join(' ')}
    onClick={props.onClick}
  >
    {props.children}
  </button>
);

button.propTypes = {
  btnType: PropTypes.string,
  btnClassNames: PropTypes.arrayOf(PropTypes.string),
  onClick: PropTypes.func,
};

button.defaultProps = {
  btnType: 'submit',
  btnClassNames: [],
  onClick: () => { },
};

export default button;
