const ERRORS = {
  PARSING_EMPTY_FILE_CONTENT: 'Parsing error: File content cannot be empty.',
  PARSING_WRONG_QUERY_FMT: 'Parsing error: Query cannot be different than uppercase letter.',
  PARSING_MULTIPLE_QUERIES: 'Parsing error: Only one line can declare queries.',
  PARSING_WRONG_INIT_FACT_FMT: 'Parsing error: Initial fact cannot be different than uppercase letter.',
  PARSING_MULTIPLE_INIT_FACTS: 'Parsing error: Only one line can declare initial facts.',
  PARSING_MALFORMED_LINE: 'Parsing error: Malformed line.',
  PARSING_RULE: 'Parsing error: Malformed rule.',
  PARSING_IMPLICATION: 'Parsing error: Malformed implication.',
};

const WARNINGS = {
  PARSING_SAME_QUERIES: 'Parsing error: Duplicates found in queries.',
  PARSING_SAME_INIT_FACTS: 'Parsing error: Duplicated found in initial facts.',
};

module.exports = { ERRORS, WARNINGS };
