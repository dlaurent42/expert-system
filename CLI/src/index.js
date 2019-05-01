const fs = require('fs');
const inquirer = require('inquirer');
const { exec } = require('child_process');
const { remove } = require('lodash');
const ExpertSystem = require('./helpers/ExpertSystem');
const solutions = require('../resources/solutions/solutions.json');

// Function permitting user to select tests to perform
const getUserChoices = () => (
  new Promise((resolve, reject) => {

    // Fetch list of directories
    let directories = [];
    try { directories = fs.readdirSync('./resources'); } catch (e) { return reject(e); }
    remove(directories, dir => dir === 'solutions');

    return inquirer
      .prompt([{
        type: 'checkbox',
        name: 'directories',
        message: 'Please select tests to perform',
        choices: directories,
        pageSize: 75,
        validate: (answer) => {
          if (answer.length < 1) return 'You must choose at least one test.';
          return true;
        },
      }])
      .then(answer => resolve(answer.directories));
  })
);

// Function used to prepare environment
const prepareEnv = directories => (
  new Promise(async (resolve) => {
    console.log('Preparing environment');
    let command = 'mkdir -p ./logs/; rm -rf ./logs/*';
    directories.forEach((dir) => {
      command += `; mkdir -p ./logs/${dir}/`;
    });
    await exec(command);
    setTimeout(() => {
      console.log('Environment ready');
      return resolve(directories);
    }, 500);
  })
);

// Function looping through test files and solving systems
const solveFiles = (directories) => {

  // Loop through directories
  directories.forEach((dir) => {

    // Fetch list of files in current testing directory
    let files = [];
    try { files = fs.readdirSync(`./resources/${dir}/`); } catch (e) { throw e; }
    if (files.length === 0) return;

    // Message
    console.log(`\nTesting '${dir.toUpperCase()}':`);

    // Loop through files in tests current directory
    files.forEach((file) => {

      // Create an error indicator
      let error = false;

      // Create a variable containing filename
      const filename = `./logs/${dir}/${file}`;

      // Get file content
      let fileContent = '';
      try { fileContent = fs.readFileSync(`./resources/${dir}/${file}`, 'utf8'); } catch (e) { throw e; }

      // Copy file content to logs
      fs.writeFileSync(filename, fileContent, 'utf8');

      // Create new expert system
      const ExpertSystemInstance = new ExpertSystem();
      ExpertSystemInstance.parseSystem(fileContent);

      // Check if any warning has been raised during parsing
      if (ExpertSystemInstance.warnings.length) {
        fs.appendFileSync(filename, `\n${ExpertSystemInstance.warnings.length} Warning(s) raised during parsing\n`, 'utf8');
        fs.appendFileSync(filename, ExpertSystemInstance.warnings, 'utf8');
        error = true;
      }

      // Check if any error has been raised during parsing
      if (ExpertSystemInstance.errors.length) {
        fs.appendFileSync(filename, `\n${ExpertSystemInstance.errors.length} Error(s) raised during parsing\n`, 'utf8');
        fs.appendFileSync(filename, ExpertSystemInstance.errors, 'utf8');
        error = true;
      }

      // Solve system
      if (error === false) ExpertSystemInstance.solveSystem();

      // Check errors
      if (error === false && ExpertSystemInstance.errors.length) {
        fs.appendFileSync(filename, `\n${ExpertSystemInstance.errors.length} Error(s) raised during execution\n`, 'utf8');
        fs.appendFileSync(filename, ExpertSystemInstance.errors, 'utf8');
        error = true;
      }

      // Print solutions
      if (error === false) {
        fs.appendFileSync(filename, '\n\nSOLUTIONS:');
        Object.entries(ExpertSystemInstance.solutions).forEach((entry) => {
          const [key, value] = entry;
          fs.appendFileSync(filename, `\n\t${key} is ${value}`, 'utf8');

          // Check if value is correct
          if (solutions[file] && value !== solutions[file][key]) error = true;
        });
      }

      if (error === false) console.log(`\x1b[32mV\x1b[0m ${file}`);
      else console.log(`\x1b[31mX\x1b[0m ${file}`);
    });

  });

};

getUserChoices()
  .then(directories => prepareEnv(directories))
  .then(directories => solveFiles(directories))
  .catch(e => console.error(e));
