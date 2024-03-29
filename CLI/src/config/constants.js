const template = require('../utils/interpolation');

const ERRORS = {
  PARSING_EMPTY_FILE_CONTENT: '[ Error ] File content cannot be empty.',
  PARSING_WRONG_QUERY_FMT: template`[ Error ] Query cannot be different than uppercase letter (line: ${'line'}).`,
  PARSING_MULTIPLE_QUERIES: template`[ Error ] Only one line can declare queries (line: ${'line'}).`,
  PARSING_WRONG_INIT_FACT_FMT: template`[ Error ] Initial fact cannot be different than uppercase letter (line: ${'line'}).`,
  PARSING_MULTIPLE_INIT_FACTS: template`[ Error ] Only one line can declare initial facts (line: ${'line'}).`,
  PARSING_MALFORMED_LINE: template`[ Error ] Malformed line (line: ${'line'}).`,
  PARSING_RULE: template`[ Error ] Malformed rule (line: ${'line'}).`,
  PARSING_IMPLICATION: template`[ Error ] Malformed implication (line: ${'line'}).`,
  PARSING_NO_QUERIES: '[ Error ] Queries are missing',
  SOLVING_CONFLICT: template`[ Error ] A conflict has been detected when evaluating ${'variable'}.`,
};

const WARNINGS = {
  PARSING_SAME_QUERIES: template`[ Warning ] Duplicates found in queries (line: ${'line'}).`,
  PARSING_SAME_INIT_FACTS: template`[ Warning ] Duplicates found in initial facts (line: ${'line'}).`,
  PARSING_NO_RULE: '[ Warning ] No rule found.',
  PARSING_NO_INITIAL_FACT: '[ Warning ] No initial fact found.',
};

module.exports = { ERRORS, WARNINGS };
