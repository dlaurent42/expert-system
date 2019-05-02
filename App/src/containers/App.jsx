import React, { Component } from 'react';

// Components
// import Header from '../components/Navigation/Header/Header';
import Footer from '../components/Navigation/Footer/Footer';
import Graph from '../components/Graph/Graph';

// Helpers
import ExpertSystem from '../helpers/ExpertSystem';

// Config
import { INPUT_FILES_LIST, INPUT_FILES_CONTENT } from '../config/constants';

// Others
import './App.css';

class App extends Component {

  state = {
    // Data relative to expert-system data
    fileContent: '',
    ExpertSystem: new ExpertSystem(),

    // Data relative to graph display
    graphDisplayMethod: 'General',
    graphDisplayData: { nodes: [], links: [] },

    // Data relative to window
    height: window.height,
    width: window.width,

  };

  // Lifecyle Hook
  componentDidMount() {

    // Add window size event listener
    window.addEventListener('resize', this.updateDimensions);

    // Check whether file content is filled or not
    if (this.state.fileContent !== '') return;

    // Flatten list of files
    const files = [];
    Object.values(INPUT_FILES_LIST).forEach(value => files.push(...value));

    // Pick a random file
    const file = files[Math.floor(Math.random() * files.length)];

    console.log(`Selected file: ${file}`);

    // Get file content based on file name
    let fileContent = '';
    Object.entries(INPUT_FILES_CONTENT).forEach((entry) => {
      const [key, value] = entry;
      if (key === file) fileContent = value;
    });

    console.log(`File content:\n${fileContent}`);
    console.log(`Width: ${window.innerWidth}, Height: ${window.innerHeight}`);

    // Create expert system
    this.state.ExpertSystem.create(fileContent);

    // Get data to draw graph
    this.setState(prevState => ({
      fileContent,
      graphDisplayData: prevState.ExpertSystem.drawGraph(prevState.graphDisplayMethod),
      height: window.innerHeight,
      width: window.innerWidth,
    }));
  }

  updateDimensions = () => {
    this.setState({
      height: window.innerHeight,
      width: window.innerWidth
    });
  }

  // Rendering
  render() {
    const graph = (this.state.graphDisplayData.nodes.length)
      ? (
        <Graph
          data={this.state.graphDisplayData}
          height={this.state.height}
          width={this.state.width}
        />
      ) : null;
    if (graph) console.log('Graph to display');
    return (
      <div className="App">
        {/* <Header /> */}
        <div className="App-container">
          {graph}
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
