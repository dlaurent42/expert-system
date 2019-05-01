import React from 'react';
import PropTypes from 'prop-types';
import './RadioInput.css';

const input = (props) => {
  const checked = (props.checked) ? { checked: true } : {};
  return (
    <label htmlFor={props.value} className="Radio-input">
      <input
        id={props.value}
        type="radio"
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        {...checked}
      />
      {props.children}
    </label>
  );
};

input.propTypes = {
  checked: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

input.defaultProps = {
  checked: false,
  onChange: () => {},
};

export default input;
