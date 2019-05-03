import React from 'react';
import PropTypes from 'prop-types';
import Form from '../../UI/Form/Form';
import Icon from '../../UI/Icon/Icon';
import Button from '../../UI/Button/Button';
import { ICONS } from '../../../config/constants';

import './FileView.css';

const fileView = props => (
  <Form show={props.show} classNames={['FileView']}>
    <div className="FileViewContent">
      {props.children.split('\n').map((child, idx) => <p key={`${child}_${idx}`}>{child}</p>)} {/*eslint-disable-line */}
    </div>
    <Button btnClassNames={['FileViewClose']} onClick={props.close}>
      <Icon active icon={ICONS.CANCEL} />
    </Button>
  </Form>
);

fileView.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};

export default fileView;
