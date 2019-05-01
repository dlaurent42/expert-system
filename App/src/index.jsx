import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faUpload,
  faPlay,
  faRandom,
  faSlidersH,
  faPalette,
  faArrowCircleLeft,
  faArrowCircleRight,
  faCheck,
  faTimes,
  faSquare,
  faCheckSquare,
  faChartBar,
  faEgg,
} from '@fortawesome/free-solid-svg-icons';

import App from './containers/App';
import * as serviceWorker from './serviceWorker';

library.add(
  faUpload,
  faPlay,
  faRandom,
  faSlidersH,
  faPalette,
  faArrowCircleLeft,
  faArrowCircleRight,
  faCheck,
  faTimes,
  faSquare,
  faCheckSquare,
  faChartBar,
  faEgg,
);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
