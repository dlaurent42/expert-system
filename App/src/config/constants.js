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
  SOLVING_CONFLICT: template`[ Error ] A conflict has been detected when evaluating ${'variable'}.`
};

const WARNINGS = {
  PARSING_SAME_QUERIES: template`[ Warning ] Duplicates found in queries (line: ${'line'}).`,
  PARSING_SAME_INIT_FACTS: template`[ Warning ] Duplicates found in initial facts (line: ${'line'}).`,
  PARSING_NO_RULE: '[ Warning ] No rule found.',
  PARSING_NO_INITIAL_FACT: '[ Warning ] No initial fact found.'
};

const GRAPH_CONFIG = {
  automaticRearrangeAfterDropNode: false,
  collapsible: false,
  directed: true,
  focusAnimationDuration: 0.75,
  focusZoom: 1,
  highlightDegree: 1,
  highlightOpacity: 1,
  linkHighlightBehavior: false,
  maxZoom: 8,
  minZoom: 0.1,
  nodeHighlightBehavior: false,
  panAndZoom: false,
  staticGraph: false,
  d3: {
    alphaTarget: 0,
    // gravity: -100,
    linkLength: 400,
    // linkStrength: 1
  },
  node: {
    color: '#ffffff',
    fontColor: '#ffffff',
    fontSize: 16,
    fontWeight: 'normal',
    highlightColor: 'SAME',
    highlightFontSize: 16,
    highlightFontWeight: 'normal',
    highlightStrokeColor: 'SAME',
    highlightStrokeWidth: 'SAME',
    labelProperty: 'id',
    mouseCursor: 'pointer',
    opacity: 1,
    renderLabel: true,
    size: 200,
    strokeColor: 'none',
    strokeWidth: 1.5,
    svg: '',
    symbolType: 'circle'
  },
  link: {
    color: '#d3d3d3',
    fontColor: '#ffffff',
    fontSize: 12,
    fontWeight: 'normal',
    highlightColor: '#d3d3d3',
    highlightFontSize: 12,
    highlightFontWeight: 'normal',
    labelProperty: 'label',
    mouseCursor: 'pointer',
    opacity: 1,
    renderLabel: true,
    semanticStrokeWidth: false,
    strokeWidth: 1.5
  }
};

const INPUT_FILES_LIST = {
  and: [
    'and_01',
    'and_02'
  ],
  brackets: [
    'brackets_01',
    'brackets_02',
    'brackets_03',
    'brackets_04',
    'brackets_05',
    'brackets_06',
    'brackets_07',
    'brackets_08',
    'brackets_09',
    'brackets_10',
    'brackets_11'
  ],
  conclusions: [
    'conclusions_01',
    'conclusions_02',
    'conclusions_03',
    'conclusions_04'
  ],
  negation: [
    'negation_01',
    'negation_02',
    'negation_03',
    'negation_04'
  ],
  or: [
    'or_01',
    'or_02',
    'or_03',
    'or_04'
  ],
  xor: [
    'xor_01',
    'xor_02',
    'xor_03',
    'xor_04'
  ]
};

const INPUT_FILES_CONTENT = {
  and_01: '# RULES\nB => A \nD + E => B \nG + H => F \nI + J => G \nG => H \nL + M => K \nO + P => L + N \nN => M \n\n# QUERIES\n?AFKP \n\n# INITIAL FACTS\n=DEIJOP\n\n# EXPECTED RESULT: AFKP is true.',
  and_02: '# RULES\nB => A \nD + E => B \nG + H => F \nI + J => G \nG => H \nL + M => K \nO + P => L + N \nN => M \n\n# QUERIES\n?AFKP \n\n# INITIAL FACTS\n=DEIJP\n\n# EXPECTED RESULT: AFP is true, K is false. ',
  brackets_01: '# RULES\nA | B + C => E \n(F | G) + H => E \n\n# QUERIES\n?E \n\n# INITIAL FACTS\n=\n\n# EXPECTED RESULT: E should be false.',
  brackets_02: '# RULES\nA | B + C => E \n(F | G) + H => E \n\n# QUERIES\n?E \n\n# INITIAL FACTS\n=A\n\n# EXPECTED RESULT: E should be true. ',
  brackets_03: '# RULES\nA | B + C => E \n(F | G) + H => E \n\n# QUERIES\n?E \n\n# INITIAL FACTS\n=B\n\n# EXPECTED RESULT: E should be false. ',
  brackets_04: '# RULES\nA | B + C => E \n(F | G) + H => E \n\n# QUERIES\n?E \n\n# INITIAL FACTS\n=C\n\n# EXPECTED RESULT: E should be false. ',
  brackets_05: '# RULES\nA | B + C => E \n(F | G) + H => E \n\n# QUERIES\n?E \n\n# INITIAL FACTS\n=AC\n\n# EXPECTED RESULT: E should be false. ',
  brackets_06: '# RULES\nA | B + C => E \n(F | G) + H => E \n\n# QUERIES\n?E \n\n# INITIAL FACTS\n=BC\n\n# EXPECTED RESULT: E should be true. ',
  brackets_07: '# RULES\nA | B + C => E \n(F | G) + H => E \n\n# QUERIES\n?E \n\n# INITIAL FACTS\n=F\n\n# EXPECTED RESULT: E should be false. ',
  brackets_08: '# RULES\nA | B + C => E \n(F | G) + H => E \n\n# QUERIES\n?E \n\n# INITIAL FACTS\n=G\n\n# EXPECTED RESULT: E should be false. ',
  brackets_09: '# RULES\nA | B + C => E \n(F | G) + H => E \n\n# QUERIES\n?E \n\n# INITIAL FACTS\n=H\n\n# EXPECTED RESULT: E should be false. ',
  brackets_10: '# RULES\nA | B + C => E \n(F | G) + H => E \n\n# QUERIES\n?E \n\n# INITIAL FACTS\n=FH\n\n# EXPECTED RESULT: E should be true. ',
  brackets_11: '# RULES\nA | B + C => E \n(F | G) + H => E \n\n# QUERIES\n?E \n\n# INITIAL FACTS\n=GH\n\n# EXPECTED RESULT: E should be true. ',
  conclusions_01: '# RULES\nB => A \nC => A \n\n# QUERIES\n?A \n\n# INITIAL FACTS\n=\n\n# EXPECTED RESULT: A should be false. ',
  conclusions_02: '# RULES\nB => A \nC => A \n\n# QUERIES\n?A \n\n# INITIAL FACTS\n=B\n\n# EXPECTED RESULT: A should be true. ',
  conclusions_03: '# RULES\nB => A \nC => A \n\n# QUERIES\n?A \n\n# INITIAL FACTS\n=C\n\n# EXPECTED RESULT: A should be true. ',
  conclusions_04: '# RULES\nB => A \nC => A \n\n# QUERIES\n?A \n\n# INITIAL FACTS\n=BC\n\n# EXPECTED RESULT: A should be true. ',
  negation_01: '# RULES\nB + !C => A \n\n# QUERIES\n?A \n\n# INITIAL FACTS\n=\n\n# EXPECTED RESULT: A should be false. ',
  negation_02: '# RULES\nB + !C => A \n\n# QUERIES\n?A \n\n# INITIAL FACTS\n=B\n\n# EXPECTED RESULT: A should be true. ',
  negation_03: '# RULES\nB + !C => A \n\n# QUERIES\n?A \n\n# INITIAL FACTS\n=C\n\n# EXPECTED RESULT: A should be false. ',
  negation_04: '# RULES\nB + !C => A \n\n# QUERIES\n?A \n\n# INITIAL FACTS\n=BC\n\n# EXPECTED RESULT: A should be false. ',
  or_01: '# RULES\nB + C => A \nD | E => B \nB => C \n\n# QUERIES\n?A \n\n# INITIAL FACTS\n=\n\n# EXPECTED RESULT: A should be false.',
  or_02: '# RULES\nB + C => A \nD | E => B \nB => C \n\n# QUERIES\n?A \n\n# INITIAL FACTS\n=D\n\n# EXPECTED RESULT: A should be true. ',
  or_03: '# RULES\nB + C => A \nD | E => B \nB => C \n\n# QUERIES\n?A \n\n# INITIAL FACTS\n=E\n\n# EXPECTED RESULT: A should be true. ',
  or_04: '# RULES\nB + C => A \nD | E => B \nB => C \n\n# QUERIES\n?A \n\n# INITIAL FACTS\n=DE\n\n# EXPECTED RESULT: A should be true. ',
  xor_01: '# RULES\nB + C => A \nD ^ E => B \nB => C \n\n# QUERIES\n?A \n\n# INITIAL FACTS\n=\n\n# EXPECTED RESULT: A should be false. ',
  xor_02: '# RULES\nB + C => A \nD ^ E => B \nB => C \n\n# QUERIES\n?A \n\n# INITIAL FACTS\n=D\n\n# EXPECTED RESULT: A should be true. ',
  xor_03: '# RULES\nB + C => A \nD ^ E => B \nB => C \n\n# QUERIES\n?A \n\n# INITIAL FACTS\n=E\n\n# EXPECTED RESULT: A should be true. ',
  xor_04: '# RULES\nB + C => A \nD ^ E => B \nB => C \n\n# QUERIES\n?A \n\n# INITIAL FACTS\n=DE\n\n# EXPECTED RESULT: A should be false. '
};

export {
  ERRORS,
  WARNINGS,
  GRAPH_CONFIG,
  INPUT_FILES_LIST,
  INPUT_FILES_CONTENT
};
