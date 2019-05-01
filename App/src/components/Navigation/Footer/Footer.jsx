import React from 'react';
import './Footer.css';

const footer = () => (
  <footer className="App-footer">
    {'Made with '}
    <span role="img" aria-label="Heart">
      ❤️
    </span>
    {' by '}
    <a className="App-link" href="https://github.com/dlaurent42" alt="github">dlaurent</a>
  </footer>
);

export default footer;
