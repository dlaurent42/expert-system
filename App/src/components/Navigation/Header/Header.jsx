import React from 'react';
import PropTypes from 'prop-types';
import { ICONS } from '../../../config/constants';
import Icon from '../../UI/Icon/Icon';
import './Header.css';

const header = props => (
  <div className="App-header">
    <div className="App-title">Expert System</div>
    <div className="App-menu">
      <Icon classNames={['Icon']} icon={ICONS.FILE} onClick={props.showFilesList} active={props.displayFilesList} />
      <Icon classNames={['Icon']} icon={ICONS.GRAPH} onClick={props.showNetworksList} active={props.displayNetworksList} />
    </div>
    {props.children}
  </div>
);

header.propTypes = {
  displayFilesList: PropTypes.bool.isRequired,
  displayNetworksList: PropTypes.bool.isRequired,
  showFilesList: PropTypes.func.isRequired,
  showNetworksList: PropTypes.func.isRequired,
};

export default header;
