// This class handles all data and methods relative to a graph construction
class Graph {

  // Variables relative to instanciation
  constructor() {
    this.vertices = {};
    this.edges = {};
  }

  // Add a vertex (= fact)
  addVertex(vertex, value) {
    if (this.vertices[vertex]) return;
    this.vertices[vertex] = value;
    this.edges[vertex] = [];
  }

  // Add edge (= rule) between two vertices (= facts)
  addEdge(edge) {
    if (!this.edges[edge.assignedTo]) this.addVertex(edge.assignedTo, false);
    this.edges[edge.assignedTo].push(edge);
  }
}

module.exports = Graph;
