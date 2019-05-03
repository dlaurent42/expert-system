import React from 'react';
import PropTypes from 'prop-types';

import './Form.css';

const form = props => (
  <form className={['App-modal', 'App-form', ...props.classNames].concat((props.show) ? 'App-modal-show' : 'App-modal-hide').join(' ')}>
    {props.children}
  </form>
);

form.propTypes = {
  show: PropTypes.bool,
  classNames: PropTypes.arrayOf(PropTypes.string),
};

form.defaultProps = {
  show: false,
  classNames: [],
};

export default form;
