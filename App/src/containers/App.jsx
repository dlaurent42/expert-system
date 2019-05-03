import React, { Component } from 'react';

// Components
import Header from '../components/Navigation/Header/Header';
import Footer from '../components/Navigation/Footer/Footer';
import Networks from '../components/Navigation/Menu/Networks';
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
    graphDisplay: true,
    graphDisplayMethod: 'General',
    graphDisplayData: { nodes: [], links: [] },

    // Data relative to window
    height: window.height,
    width: window.width,

    // Data relative to menu
    displayFilesList: false,
    displayNetworksList: false,

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

    console.log(`Selected file: ${file}`); // DEBUG

    // Get file content based on file name
    let fileContent = '';
    Object.entries(INPUT_FILES_CONTENT).forEach((entry) => {
      const [key, value] = entry;
      if (key === file) fileContent = value;
    });

    console.log(`File content:\n${fileContent}`); // DEBUG
    console.log(`Width: ${window.innerWidth}, Height: ${window.innerHeight}`); // DEBUG

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

  // Event listener(s)
  updateDimensions = () => {
    const { graphDisplay } = this.state;
    this.setState({
      graphDisplay: false,
      height: window.innerHeight,
      width: window.innerWidth
    }, () => this.setState({ graphDisplay }));
  }

  // Display handlers
  showFilesList = () => {
    this.setState(prevState => ({
      displayFilesList: !prevState.displayFilesList,
      displayNetworksList: false,
    }), () => this.updateDimensions());
  }

  showNetworksList = () => {
    this.setState(prevState => ({
      displayFilesList: false,
      displayNetworksList: !prevState.displayNetworksList,
    }), () => this.updateDimensions());
  }

  // Click menu handlers
  onNetworkChange = (e) => {
    e.preventDefault();
    const graphDisplayMethod = e.target.value;
    if (graphDisplayMethod === this.state.graphDisplayMethod) return;
    this.setState(prevState => ({
      graphDisplay: false,
      graphDisplayData: prevState.ExpertSystem.drawGraph(graphDisplayMethod),
      graphDisplayMethod,
      displayNetworksList: false,
    }), () => this.setState({ graphDisplay: true }));
  }

  // Rendering
  render() {
    const graph = (this.state.graphDisplay
      && this.state.graphDisplayData.nodes.length
      && this.state.graphDisplayData.links)
      ? (
        <Graph
          data={this.state.graphDisplayData}
          height={this.state.height}
          width={this.state.width}
        />
      ) : <div>No enough data to draw graph.</div>;
    if (graph) console.log('Graph to display');
    return (
      <div className="App">
        <Header
          displayFilesList={this.state.displayFilesList}
          displayNetworksList={this.state.displayNetworksList}
          showFilesList={this.showFilesList}
          showNetworksList={this.showNetworksList}
        >
          <Networks
            show={this.state.displayNetworksList}
            close={this.showFilesList}
            queries={this.state.ExpertSystem.queries}
            selectedNetword={this.state.graphDisplayMethod}
            onNetworkChange={this.onNetworkChange}
          />
        </Header>
        <div className="App-container">
          {graph}
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
