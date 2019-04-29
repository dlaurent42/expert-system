const Graph = require('./helpers/Graph');

const ExpertSystemGraph = new Graph();

ExpertSystemGraph.addVertex('A', true);
ExpertSystemGraph.addVertex('B', true);
ExpertSystemGraph.addVertex('C', false);
ExpertSystemGraph.addVertex('D', false);
ExpertSystemGraph.addVertex('E', undefined);
// ExpertSystemGraph.addVertex('F');
// ExpertSystemGraph.addVertex('G');
// ExpertSystemGraph.addVertex('H');
// ExpertSystemGraph.addVertex('V');
// ExpertSystemGraph.addVertex('W');
// ExpertSystemGraph.addVertex('X');
// ExpertSystemGraph.addVertex('Y');
// ExpertSystemGraph.addVertex('Z');

ExpertSystemGraph.addEdge({ to: 'C', operation: 'A => C', vertices: ['A'], visited: false, isNegative: false });
ExpertSystemGraph.addEdge({ to: 'C', operation: 'X => C', vertices: ['X'], visited: false, isNegative: false });
ExpertSystemGraph.addEdge({ to: 'D', operation: 'D => A', vertices: ['A'], visited: false, isNegative: false });
ExpertSystemGraph.addEdge({ to: 'A', operation: 'A => E', vertices: ['E'], visited: false, isNegative: false });

console.log('Vertices');
Object.keys(ExpertSystemGraph.vertices).forEach((key) => {
  console.log(`    ${key} is ${ExpertSystemGraph.vertices[key]}`)
});
console.log('\nEdges');

console.log(ExpertSystemGraph.edges);
