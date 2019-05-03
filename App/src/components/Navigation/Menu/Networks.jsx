import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../UI/Icon/Icon';
import Form from '../../UI/Form/Form';
import RadioInput from '../../UI/Input/RadioInput';
import { ICONS } from '../../../config/constants';

const networks = (props) => {
  (props.show)
    ? (
      <div />
    ) : null
};

networks.propTypes = {
  show: PropTypes.bool.isRequired,
  selectedNetword: PropTypes.string.isRequired,
  onNetworkChange: PropTypes.func.isRequired,
};

export default networks;
