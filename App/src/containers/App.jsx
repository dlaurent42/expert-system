import React, { Component } from 'react';

// Components
import Header from '../components/Navigation/Header/Header';
import Footer from '../components/Navigation/Footer/Footer';

// Helpers

// Others
import './App.css';

class App extends Component {
  state = {};

  // Lifecyle Hook
  componentDidMount() {
    console.log('componentDidMount triggered');
  }

  // Rendering
  render() {
    return (
      <div className="App">
        <Header />
        <div className="App-container" />
        <Footer />
      </div>
    );
  }
}

export default App;
