import React from 'react';
import PropTypes from 'prop-types';
import Form from '../../UI/Form/Form';
import Icon from '../../UI/Icon/Icon';
import Button from '../../UI/Button/Button';
import RadioInput from '../../UI/Input/RadioInput';
import { ICONS } from '../../../config/constants';
import './Networks.css';

const networks = props => (
  <Form show={props.show} classNames={['Networks']}>
    {['General'].concat(props.queries).map(network => (
      (props.selectedNetword === network)
        ? (
          <RadioInput name="networks" key={network} onChange={props.onNetworkChange} value={network}>
            {network}
            <Icon icon={ICONS.CHECKBOX} active />
          </RadioInput>
        ) : (
          <RadioInput name="networks" key={network} onChange={props.onNetworkChange} value={network}>
            {network}
            <Icon icon={ICONS.EMPTYCHECKBOX} active />
          </RadioInput>
        )
    ))}
    <Button btnClassNames={['Cancel']} onClick={props.close}>
      <Icon active icon={ICONS.CANCEL} />
    </Button>
  </Form>
);

networks.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  queries: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedNetword: PropTypes.string.isRequired,
  onNetworkChange: PropTypes.func.isRequired,
};

export default networks;
