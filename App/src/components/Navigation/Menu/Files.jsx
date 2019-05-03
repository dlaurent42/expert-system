import React from 'react';
import PropTypes from 'prop-types';

import Form from '../../UI/Form/Form';
import Button from '../../UI/Button/Button';
import CheckboxInput from '../../UI/Input/CheckboxInput';
import RadioInput from '../../UI/Input/RadioInput';
import Icon from '../../UI/Icon/Icon';
import { INPUT_FILES_LIST, ICONS } from '../../../config/constants';

import './Files.css';

const files = (props) => {

  // Create files list
  const filesList = [];
  Object.entries(INPUT_FILES_LIST).forEach((entry) => {
    const [key, values] = entry;
    if (!props.collapsedSections.includes(key)) {
      filesList.push(
        <div key={key} className="FilesSublist">
          <CheckboxInput value={key} name={key} onChange={props.collapseSection}>
            <span>{key}</span>
            <span>+</span>
          </CheckboxInput>
        </div>
      );
    } else {
      filesList.push(
        <div key={key} className="FilesSublist">
          <CheckboxInput value={key} name={key} onChange={props.collapseSection}>
            <span>{key}</span>
            <span>-</span>
          </CheckboxInput>
          {values.map(value => (
            <div key={value} className="File">
              <RadioInput value={value} name={`${key}_sub`} onChange={props.onFileChange}>
                {value}
              </RadioInput>
              <Icon icon={ICONS.EYE} classNames={['ViewContent']} onClick={() => props.onFileView(value)} />
            </div>
          ))}
        </div>
      );
    }
  });

  // Return form
  return (
    <Form show={props.show} classNames={['Files']}>
      {filesList}
      <Button btnClassNames={['Cancel']} onClick={props.close}>
        <Icon active icon={ICONS.CANCEL} />
      </Button>
    </Form>
  );
};

files.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  collapseSection: PropTypes.func.isRequired,
  collapsedSections: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFileView: PropTypes.func.isRequired,
  onFileChange: PropTypes.func.isRequired,
};

export default files;
