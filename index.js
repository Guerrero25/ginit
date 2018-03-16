var chalk = require("chalk");
var clear = require("clear");
var figlet = require("figlet");
var files = require("./lib/files");
var inquirer = require("./lib/inquirer");

clear();
console.log(
    chalk.yellow(
        figlet.textSync('Ginit', {horizontalLayout: 'full'})
    )
);

if (files.directoryExits('.git')) {
    console.log(chalk.red('Alredy a git repository!'));
    process.exit();
}

const run = async () => {
    const credentials = await inquirer.askGithubCredentials();
    console.log(credentials);
}

run();