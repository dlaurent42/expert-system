const { find } = require('lodash');

const CHAR_TYPE = {
  NONE: 0,
  OPERATOR: 1,
  TOKEN: 2,
  OPENING_PARENTHESE: 3,
  CLOSING_PARENTHESE: 4,
  NEGATION: 5,
};

const OPERATORS = [{
  operator: '(',
  precedence: 0,
  type: CHAR_TYPE.OPENING_PARENTHESE,
  acceptedPreviousCharTypes: [
    CHAR_TYPE.NONE,
    CHAR_TYPE.OPERATOR,
    CHAR_TYPE.OPENING_PARENTHESE,
  ],
}, {
  operator: ')',
  precedence: 0,
  type: CHAR_TYPE.CLOSING_PARENTHESE,
  acceptedPreviousCharTypes: [
    CHAR_TYPE.TOKEN,
    CHAR_TYPE.OPENING_PARENTHESE,
    CHAR_TYPE.CLOSING_PARENTHESE,
  ],
}, {
  operator: '!',
  precedence: 4,
  type: CHAR_TYPE.NEGATION,
  acceptedPreviousCharTypes: [
    CHAR_TYPE.NONE,
    CHAR_TYPE.OPERATOR,
  ],
}, {
  operator: '+',
  precedence: 3,
  type: CHAR_TYPE.OPERATOR,
  acceptedPreviousCharTypes: [
    CHAR_TYPE.TOKEN,
    CHAR_TYPE.CLOSING_PARENTHESE,
  ],
}, {
  operator: '|',
  precedence: 2,
  type: CHAR_TYPE.OPERATOR,
  acceptedPreviousCharTypes: [
    CHAR_TYPE.TOKEN,
    CHAR_TYPE.CLOSING_PARENTHESE,
  ],
}, {
  operator: '^',
  precedence: 1,
  type: CHAR_TYPE.OPERATOR,
  acceptedPreviousCharTypes: [
    CHAR_TYPE.TOKEN,
    CHAR_TYPE.CLOSING_PARENTHESE,
  ],
}];

const isToken = input => /^[A-Z]$/.test(input);
const isTokenAllowed = lastCharType => (
  lastCharType === CHAR_TYPE.OPERATOR
  || lastCharType === CHAR_TYPE.NEGATION
  || lastCharType === CHAR_TYPE.OPENING_PARENTHESE
);
const isValidOperator = (lastCharType, char) => {
  const operator = find(OPERATORS, { operator: char });
  if (!operator) return false;
  if (!operator.acceptedPreviousCharTypes.includes(lastCharType)) return false;
  return operator;
};

const evaluateRPN = (brutRule, values) => {

  // Copy input rule
  const rule = brutRule.map(el => ((isToken(el)) ? values[el] : el));
  console.log(rule);
  // Solving loop
  while (rule.length > 1) {

    // Loop through array until something can be calculated
    let idx = 0;
    while (idx < rule.length) {

      // Check if there is a negation
      if (typeof rule[idx] === 'boolean' && rule[idx + 1] === '!') {

        console.log('Negation found');
        rule[idx] = !rule[idx + 1];
        rule.splice(idx + 1, 1);
        break;

      // Check if there is an operator
      } else if (typeof rule[idx] === 'boolean' && typeof rule[idx + 1] === 'boolean' && typeof rule[idx + 2] !== 'boolean') {
        console.log('Operator found');
        if (rule[idx + 2] === '|') rule[idx] = rule[idx] || rule[idx + 1];
        else if (rule[idx + 2] === '+') rule[idx] = rule[idx] && rule[idx + 1];
        else if (rule[idx + 2] === '^') {
          rule[idx] = ((rule[idx] && !rule[idx + 1]) || (!rule[idx] && rule[idx + 1]));
        } else console.log(`Euuuuuh... ${rule[idx + 2]}`);
        rule.splice(idx + 1, 2);
        break;
      } else {
        console.log('Other');
        idx += 1;
      }
    }
  }
  return rule[0];
};

class ReversePolishNotation {

  constructor() {
    this.error = false;
    this.output = [];
    this.operatorStack = [];
    this.uniqueTokens = [];
  }

  transform(input) {

    // Indicators used in parsing
    let openedParentheses = 0;
    let lastCharType = 0;

    // Loop through characters
    input.replace(/ /g, '').split('').forEach((char, idx) => {

      // Verify errors
      if (this.error) return;

      // Verify first char
      if (idx === 0 && !isToken(char) && char !== '!' && char !== '(') {
        this.error = true;

      // Verify first char as a token
      } else if (idx === 0 && isToken(char)) {
        this.output.push(char);
        lastCharType = CHAR_TYPE.TOKEN;

      // Verify if token and token is allowed
      } else if (isToken(char) && !isTokenAllowed(lastCharType)) {
        this.error = true;
      } else if (isToken(char)) {
        this.output.push(char);
        lastCharType = CHAR_TYPE.TOKEN;

      // If none of the above, then it is an operator
      } else {

        // Verify operator is valid
        const operator = isValidOperator(lastCharType, char);
        if (!operator) {
          this.error = true;
          return;
        }

        // Verify if type of operand is opening parenthese
        if (char === '(') {
          this.operatorStack.unshift(operator);
          lastCharType = CHAR_TYPE.OPENING_PARENTHESE;
          openedParentheses += 1;

        // Verify if type of operand is closing parenthese
        } else if (char === ')') {
          while (this.operatorStack.length && this.operatorStack[0].operator !== '(') {
            const ope = this.operatorStack.shift();
            this.output.push(ope.operator);
          }
          if (this.operatorStack.length === 0) {
            this.error = true;
          } else {
            this.operatorStack.shift();
          }
          lastCharType = CHAR_TYPE.CLOSING_PARENTHESE;
          openedParentheses -= 1;

        // Check precedence
        } else if (this.operatorStack.length === 0
        || operator.precedence > this.operatorStack[0].precedence) {
          lastCharType = (char === '!') ? CHAR_TYPE.NEGATION : CHAR_TYPE.OPERATOR;
          this.operatorStack.unshift(operator);
        } else {
          lastCharType = (char === '!') ? CHAR_TYPE.NEGATION : CHAR_TYPE.OPERATOR;
          while (this.operatorStack.length
          && operator.precedence <= this.operatorStack[0].precedence) {
            const ope = this.operatorStack.shift();
            this.output.push(ope.operator);
          }
          this.operatorStack.unshift(operator);
        }
      }
    });

    // Push all operators in operator stack to output
    while (this.operatorStack.length) {
      const ope = this.operatorStack.shift();
      this.output.push(ope.operator);
    }

    // Check number of parentheses
    if (openedParentheses) this.error = true;

    // Get unique tokens
    this.uniqueTokens = [...[...new Set(input.replace(/[\W_]+/g, '').split(''))].sort()];
  }

  print() {
    if (this.error) console.log('Please note errors have been found when transforming.');
    console.log(this.output.join(' '));
  }
}

module.exports = { ReversePolishNotation, evaluateRPN };
