import React from 'react';
import PropTypes from 'prop-types';
import './TextInput.css';

const input = props => (
  <label htmlFor="inp" className="Text-input">
    <input type="text" id="inp" placeholder="&nbsp;" value={props.value} onChange={props.onChange} />
    <span className="Label">{props.label}</span>
    <span className="Border" />
  </label>
);

input.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

input.defaultProps = {
  label: ''
};

export default input;
