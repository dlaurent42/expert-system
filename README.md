# EXPERT-SYSTEM

#### Final Mark: 125 / 125


## Introduction by 42 School

A backward-chaining inference engine must be implemented. Rules and facts will be given as a text file, the format of which is described in the appendix. A fact can be any uppercase alphabetical character.

The program must accept one parameter, which is the input file. It will contain a list of rules, then a list of initial facts, then a list of queries. For each of these queries, the program must, given the facts and rules given, tell if the query is true, false, or undetermined.

By default, all facts are false, and can only be made true by the initial facts statement, or by application of a rule. A fact can only be undetermined if the ruleset is ambiguous, for example if I say "A is true, also if A then B or C", then B and C are undetermined.

If there is an error in the input, for example a contradiction in the facts, or a syntax error, the program must inform the user of the problem.

## Features

• "AND" conditions. For example, "If A and B and [...] then X"
• "OR" conditions. For example, "If C or D then Z"
• "XOR" conditions. For example, "If A xor E then V". Remember that this means "exclusive OR". It is only true if one and only one of the operands is true.
• Negation. For example, "If A and not B then Y"
• Multiple rules can have the same fact as a conclusion 
• "AND" in conclusions. For example, "If A then B and C"
• Parentheses in expressions. Interpreted in much the same way as an arithmetic expression.

## Objectives

The goal of this project is to make an expert system for propositional calculus.

Project has been realized using Javascript and is composed of 2 distincts parts:
- A Command Line Interface (CLI) using Inquirer module.
- A web client using ReactJS.

## Skills

- Rigor 
- Algorithms & AI 
- Group & interpersonal 

## Previews

### General graph view and file selection menu

![General graph view and file selection menu screenshot](https://github.com/dlaurent42/expert-system/blob/master/docs/menu1.png)

### Node solving graph view and view selection menu

![Node solving graph view and view selection menu screenshot](https://github.com/dlaurent42/expert-system/blob/master/docs/menu2.png)
