import React from 'react';
import PropTypes from 'prop-types';

import { INPUT_FILES_LIST } from '../../../config/constants';

const files = (props) => {
  Object.entries(INPUT_FILES_LIST).forEach((entry) => {
    const [key, value] = entry;
    console.log(`${key}: ${value}`);
  });
  return ((props.show) ? <div /> : null);
};

files.propTypes = {
  show: PropTypes.bool.isRequired,
};

export default files;
