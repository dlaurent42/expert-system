// Modules
const { isEmpty, cloneDeep, remove } = require('lodash');

// Helpers
const Graph = require('./Graph');
const PriorityQueue = require('./PriorityQueue');
const { ReversePolishNotation, evaluateRPN } = require('./ReversePolishNotation');

// Constants
const { ERRORS, WARNINGS } = require('../config/constants');

// This class handles all data and methods relative to the system
class ExpertSystem {

  // Variables relative to instanciation
  constructor() {
    this.Graph = new Graph();
    this.rules = [];
    this.queries = [];
    this.vertices = [];
    this.initialFacts = [];
    this.errors = [];
    this.warnings = [];
    this.solutions = [];
  }

  // Method taking file content as input and setting up problem
  parseSystem(fileContent) {

    // Verify wheter file content is empty or not
    if (isEmpty(fileContent)) {
      this.errors.push(ERRORS.PARSING_EMPTY_FILE_CONTENT);
      return;
    }

    // Declare variables used to parse file content
    let linesCounter = 0;
    let initialFactsEncountered = false;
    let queriesEncountered = false;

    // Loop through file content lines
    fileContent.trim().split('\n').forEach((line) => {

      // Increment lines counter
      linesCounter += 1;

      // Skip comments
      if (line.trim().startsWith('#') || line.trim() === '') return;

      // Remove comments from comments
      const parsedLine = line.replace(/  +/g, ' ').trim().split('#')[0].trim();

      // Add letters to vertices
      this.vertices.push(...[...new Set(parsedLine.replace(/[\W_]+/g, '').split(''))].sort());

      /*
        Check if line corresponds to a rule, to initial facts or to queries
      */

      // Queries
      if (parsedLine.startsWith('?') && queriesEncountered) this.errors.push(ERRORS.PARSING_MULTIPLE_QUERIES({ line: linesCounter }));
      else if (parsedLine.startsWith('?')) {

        // Loop through characters
        parsedLine.split('').forEach((char, idx) => {

          if (idx === 0) return;
          if (this.queries.includes(char)) {
            this.warnings.push(WARNINGS.PARSING_SAME_QUERIES({ line: linesCounter }));
          } else if (/^[A-Z]$/.test(char) === false) this.errors.push(ERRORS.PARSING_WRONG_QUERY_FMT({ line: linesCounter }));
          else this.queries.push(char);

        });

        // Modify queriesEncountered indicator
        queriesEncountered = true;

      // Initial facts
      } else if (parsedLine.startsWith('=') && initialFactsEncountered) this.errors.push(ERRORS.PARSING_MULTIPLE_INIT_FACTS({ line: linesCounter }));
      else if (parsedLine.startsWith('=')) {

        // Loop through characters
        parsedLine.split('').forEach((char, idx) => {

          if (idx === 0) return;
          if (this.initialFacts.includes(char)) {
            this.warnings.push(WARNINGS.PARSING_SAME_INIT_FACTS({ line: linesCounter }));
          } else if (/^[A-Z]$/.test(char) === false) this.errors.push(ERRORS.PARSING_WRONG_INIT_FACT_FMT({ line: linesCounter }));
          else this.initialFacts.push(char);

        });

        // Modify initialFactsEncountered indicator
        initialFactsEncountered = true;

      // Rules
      } else {

        // Split line
        const splittedLine = parsedLine.split(/=>/);

        // Check number of blocks resulting from split
        if (splittedLine.length !== 2) {
          this.errors.push(ERRORS.PARSING_MALFORMED_LINE({ line: linesCounter }));
          return;
        }

        // Get Reverse Polish Notation from left part of equation
        const RPN = new ReversePolishNotation();
        RPN.transform(splittedLine[0].trim());

        // Check errors
        if (RPN.error) this.errors.push(ERRORS.PARSING_RULE({ line: linesCounter }));

        // Assess implications
        splittedLine[1].replace(/ /g, '').split('+').forEach((implication) => {
          let isNegative = false;
          if (/^![A-Z]$/.test(implication)) isNegative = true;
          else if (/^[A-Z]$/.test(implication) === false) this.errors.push(ERRORS.PARSING_IMPLICATION({ line: linesCounter }));
          this.rules.push({
            assignedTo: (isNegative) ? implication[1] : implication[0],
            rpnOperation: RPN.output,
            verticesInvolved: RPN.uniqueTokens,
            visited: true,
            isNegative,
            cost: 1,
          });
        });
      }

    });

    // Remove duplicated from vertices
    this.vertices = this.vertices.filter((v, i) => this.vertices.indexOf(v) === i);

    // Create graph vertices
    this.vertices.forEach((vertex) => {
      if (this.initialFacts.includes(vertex)) this.Graph.addVertex(vertex, true);
      else if (this.queries.includes(vertex)) this.Graph.addVertex(vertex, undefined);
      else this.Graph.addVertex(vertex, false);
    });

    // Create graph edges
    this.rules.forEach((rule, idx) => {
      this.Graph.addEdge(Object.assign(rule, { id: idx }));
    });
  }

  // Method used to assess priorization level for a given edge
  static edgePriorization(edge, vertices) {

    // Variable containing priorization
    let priorization = 0;

    // For each vertex involved, if vertex value is undefined, then we add 1
    edge.verticesInvolved.forEach((vertex) => {
      priorization += (vertices[vertex] === undefined);
    });

    return priorization;
  }

  // Method used to solve system
  solveSystem() {

    // There are as many system to solve as queries
    this.queries.forEach((query) => {

      // Check if query is not given in initial facts
      if (this.initialFacts.includes(query)) {
        console.log(`Initial facts provides ${query} value.`);
        this.solutions.push({ [query]: true });
        return;
      }

      // Check if there are edges to assess given query value
      if (this.Graph.edges[query].length === 0) {
        console.log(`No rule found to assess ${query}.`);
        this.solutions.push({ [query]: 'No rule found.' });
        return;
      }

      // For each system to solve, a solving, an available and a closed queue are set
      const SolvingQueue = new PriorityQueue();
      const availableQueue = cloneDeep(this.Graph.edges);
      const closedQueue = [];
      const verticesValues = cloneDeep(this.Graph.vertices);
      console.log(`Initialisation of Priority queue for ${query}`);
      availableQueue[query].forEach((edge) => {
        SolvingQueue.enqueueElement(edge, this.edgePriorization(edge, verticesValues));
      });

      // Remove elements from available queue
      availableQueue[query] = [];

      // Solving loop
      while (SolvingQueue.items.length) {

        // Get first element from open set
        const { element, priority } = SolvingQueue.dequeueElement();

        // Verify priority level
        if (priority === 0) {

          // Priority level equal 0 means there is no unknown node

          // Assess RPN
          verticesValues[element.assignedTo] = evaluateRPN(element.rpnOperation, verticesValues);

          // Move to closeSet current edge
          closedQueue.push(element);

          // Delete from Solving Queue any element where assignedTo = el.assignedTo
          remove(SolvingQueue.items, elem => element.assignedTo === elem.assignedTo);

          // If the rule is assigned to query, then solution is found
          if (element.assignedTo === query) {
            this.solutions.push({ [query]: verticesValues[element.assignedTo] });
          }

        } else {

          // Priority level gt 0 means there is at least 1 unknown node

          // Check for each unknown node if there is at leat 1 edge
          let error = false;
          element.verticesInvolved.forEach((vertice) => {

            // If node has no available rule to assess its value, then an error is raised
            if (verticesValues[vertice] === undefined && availableQueue[vertice].length === 0) {
              this.solutions.push({ [query]: 'No enough data.' });
              error = true;

            // If node has at least a rule to assess its value,
            // its rules are pushed to solving queue and removed from available queue
            } else if (verticesValues[vertice] === undefined && availableQueue[vertice].length) {
              availableQueue[vertice].forEach((edge) => {
                SolvingQueue.enqueueElement(edge, this.edgePriorization(edge, verticesValues));
              });
              availableQueue[vertice] = [];
            }
          });
          if (error) break;
        }
      }
    });
  }

  // Method used for debug purpose
  print() {
    console.log('\n\nPARSING');
    console.log('\nRules');
    console.log(this.rules);
    console.log('\nQueries');
    console.log(this.queries);
    console.log('\nVertices');
    console.log(this.vertices);
    console.log('\nInitial facts');
    console.log(this.initialFacts);
    console.log('\nWarnings');
    console.log(this.warnings);
    console.log('\nErrors');
    console.log(this.errors);
    console.log('\n---------------------------------------------------');
    console.log('\n\nGRAPH');
    console.log('\nVertices');
    console.log(this.Graph.vertices);
    console.log('\nEdges');
    console.log(this.Graph.edges);
  }


}

module.exports = ExpertSystem;
