import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

/* eslint-disable react/button-has-type */
const button = props => (
  <button
    type={props.btnType}
    className={['Button', props.btnAttr].join(' ')}
    onClick={props.onClick}
  >
    {props.children}
  </button>
);

button.propTypes = {
  btnType: PropTypes.string,
  btnAttr: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

button.defaultProps = {
  btnType: 'submit',
  btnAttr: '',
};

export default button;
