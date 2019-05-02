import React from 'react';
import PropTypes from 'prop-types';
import { Graph } from 'react-d3-graph';

import { GRAPH_CONFIG } from '../../config/constants';

const graph = props => (
  <Graph
    id="graph-id"
    data={props.data}
    config={Object.assign(GRAPH_CONFIG, { height: props.height, width: props.width })}
  // onClickNode={onClickNode}
  // onRightClickNode={onRightClickNode}
  // onClickGraph={onClickGraph}
  // onClickLink={onClickLink}
  // onRightClickLink={onRightClickLink}
  // onMouseOverNode={onMouseOverNode}
  // onMouseOutNode={onMouseOutNode}
  // onMouseOverLink={onMouseOverLink}
  // onMouseOutLink={onMouseOutLink}
  />
);

graph.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

export default graph;
