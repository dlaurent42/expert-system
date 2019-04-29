const { omit } = require('lodash');

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
    if (!this.edges[edge.to]) this.addVertex(edge.to, false);
    this.edges[edge.to].push(omit(edge, 'to'));
  }
}

module.exports = Graph;

/*
  Graph structure
  Graph.prototype.addEdge = function(vertex1, vertex2) {
    this.edges[vertex1].push(vertex2);
    this.edges[vertex2].push(vertex1);
    this.numberOfEdges++;
  };
  Graph.prototype.addVertex = function(vertex) {
    this.vertices.push(vertex);
    this.edges[vertex] = [];
  };
*/

/*

FILE FORMAT

# this is a comment$
# all the required rules and symbols, along with the bonus ones, will be
# shown here. spacing is not important

C => E            #   C implies E
A + B + C => D    #   A and B and C implies D
A | B => C        #   A or B implies C
A + !B => F       #   A and not B implies F
C | !G => H       #   C or not G implies H
V ^ W => X        #   V xor W implies X
A + B => Y + Z    #   A and B implies Y and Z
C | D => X | V    #   C or D implies X or V
E + F => !V       #   E and F implies not V
A + B <=> C       #   A and B if and only if C
A + B <=> !C      #   A and B if and only if not C

=ABG # Initial facts : A, B and G are true. All others are false.

# If no facts are initially true, then a simple "=" followed
# by a newline is used
?GVX # Queries : What are G, V and X ?

# Notes
-  A <=> B can be traduced une 2 rules: A => B and B => A
-  Do not handle OR and XOR in conclusions nor if and only if
-  To Handle AND in conclusions, do A + B => Y + Z to A + B => Y and A + B => Z
*/
