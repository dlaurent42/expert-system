// Modules
import { isEmpty } from 'lodash';

// Helpers
import Tree from './Tree';
import { ReversePolishNotation, evaluateRPN } from './ReversePolishNotation';

// Constants
import { ERRORS, WARNINGS } from '../config/constants';

// This class handles all data and methods relative to the system
class ExpertSystem {

  // Variables relative to instanciation
  constructor() {
    this.rules = [];
    this.queries = [];
    this.variables = [];
    this.initialFacts = [];
    this.errors = [];
    this.warnings = [];
    this.solutions = {};
    this.trees = [];
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
    let rulesEncountered = false;
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

      // Add letters to variables list
      this.variables.push(...[...new Set(parsedLine.replace(/[\W_]+/g, '').split(''))].sort());

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
            ruleId: this.rules.length,
            assignedTo: (isNegative) ? implication[1] : implication[0],
            rpnOperation: RPN.output,
            variablesInvolved: RPN.uniqueTokens,
            isNegative,
          });
        });

        rulesEncountered = true;
      }

    });

    // Look for errors
    if (this.queries.length === 0) queriesEncountered = false;
    if (queriesEncountered === false) this.errors.push(ERRORS.PARSING_NO_QUERIES);
    if (rulesEncountered === false) this.warnings.push(WARNINGS.PARSING_NO_RULE);
    if (initialFactsEncountered === false) this.warnings.push(WARNINGS.PARSING_NO_INITIAL_FACT);

    // Remove duplicated from variables and assign values
    this.variables = this.variables
      .filter((v, i) => this.variables.indexOf(v) === i)
      .map((variable) => {
        if (this.initialFacts.includes(variable)) return { [variable]: true };
        return { [variable]: false };
      });
  }

  // Method used to solve system and assess queries
  solveSystem() {

    // Loop through queries
    this.queries.forEach((query) => {

      // Build tree based on data
      const tree = new Tree(query, [...this.rules], [...this.variables]);
      tree.build();
      this.trees.push(tree);

      // Check wheter tree is empty or not
      if (tree.length === 0) {
        this.solutions[tree.query] = tree.variables[tree.query].value;
        return;
      }

      // Loop through levels
      while (tree.lvlMax >= 0) {

        // Loop through branches
        tree.branches.forEach((branch) => {

          // Check level of branch
          if (branch.lvl !== tree.lvlMax) return;

          // Evaluate RPN
          const rpnSolution = evaluateRPN(branch.rpnOperation, tree.variables, branch.isNegative);

          // Check if implication is correct
          if (rpnSolution === false) return;

          // Check if there is a conflict
          if (tree.variables[branch.assignedTo].evaluated
            && tree.variables[branch.assignedTo].value !== rpnSolution) {
            this.errors.push(ERRORS.SOLVING_CONFLICT({ variable: branch.assignedTo }));
          }

          // Assign value to variable
          Object.assign(tree.variables[branch.assignedTo], { value: rpnSolution, evaluated: true });
        });

        // Decrease level by one
        tree.lvlMax -= 1;
      }

      // Push solution
      this.solutions[tree.query] = tree.variables[tree.query].value;
    });
  }
}

export default ExpertSystem;
