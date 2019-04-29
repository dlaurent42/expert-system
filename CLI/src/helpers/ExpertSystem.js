// Modules
const { isEmpty } = require('lodash');

// Helpers
const Graph = require('./Graph');
const PriorityQueue = require('./PriorityQueue');
const ReversePolishNotation = require('./ReversePolishNotation');

// Constants
const { ERRORS, WARNINGS } = require('../config/constants');

// This class handles all data and methods relative to the system
class ExpertSystem {

  // Variables relative to instanciation
  constructor() {
    this.Graph = new Graph();
    this.PriorityQueue = new PriorityQueue();
    this.queries = [];
    this.initialFacts = [];
    this.rules = [];
  }

  // Method taking file content as input and setting up problem
  parseSystem(fileContent) {

    // Declare an array containing errors encountered
    const errors = [];
    const warnings = [];

    // Verify wheter file content is empty or not
    if (isEmpty(fileContent)) return [ERRORS.PARSING_EMPTY_FILE_CONTENT];

    // Declare variables used to parse file content
    let linesCounter = 0;
    let initialFactsEncountered = false;
    let queriesEncountered = false;

    // Loop through file content lines
    fileContent.trim().split('\n').forEach((line) => {

      // Increment lines counter
      linesCounter += 1;

      // Skip comments
      if (line.trim().startsWith('#')) return;
      
      // Remove comments from comments
      const parsedLine = line.replace(/  +/g, ' ').trim().split('#')[0].trim();

      /*
        Check if line corresponds to a rule, to initial facts or to queries
      */

      // Queries
      if (parsedLine.startsWith('?') && queriesEncountered) errors.push(ERRORS.PARSING_MULTIPLE_QUERIES);
      else if (parsedLine.startsWith('?')) {

        // Loop through characters
        parsedLine.forEach((char, idx) => {

          if (idx === 0) return;
          if (this.queries.includes(char)) warnings.push(WARNINGS.PARSING_SAME_QUERIES);
          else if (char !== char.toUpperCase()) errors.push(ERRORS.PARSING_WRONG_QUERY_FMT)
          else this.queries.push(char);

        });

      // Initial facts
      } else if (parsedLine.startsWith('=') && initialFactsEncountered) errors.push(ERRORS.PARSING_MULTIPLE_INIT_FACTS);
      else if (parsedLine.startsWith('=')) {

        // Loop through characters
        parsedLine.forEach((char, idx) => {

          if (idx === 0) return;
          if (this.initialFacts.includes(char)) warnings.push(WARNINGS.PARSING_SAME_INIT_FACTS);
          else if (char !== char.toUpperCase()) errors.push(ERRORS.PARSING_WRONG_INIT_FACT_FMT)
          else this.initialFacts.push(char);

        });

      // Rules
      } else {

        // Split line
        const splittedLine = parsedLine.split(/=>/);

        // Check number of blocks resulting from split
        if (splittedLine.length !== 2) {
          errors.push(ERRORS.PARSING_MALFORMED_LINE);
          return;
        }

        // Get Reverse Polish Notation from left part of equation
        const RPN = new ReversePolishNotation();
        RPN.transform(splittedLine[0]);

        // Check errors
        if (RPN.error) errors.push(ERRORS.PARSING_RULE);

        // Assess implications
        const implicationsPart = splittedLine[1].replace(/  +/g, ' ').split('+');
        implicationsPart.forEach((implication) => {
          if (/^[A-Z]$/.test(implication)) console.log('Implication (positive)');
          else if (/^\![A-Z]$/) console.log('Implication (negative)');
          else errors.push(ERRORS.PARSING_IMPLICATION);
        });
      }

    });

    return [errors, warnings];
  }
}

module.exports = ExpertSystem;


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
-  Do not handle OR and XOR in conclusions
-  To Handle AND in conclusions, do A + B => Y + Z to A + B => Y and A + B => Z
*/
