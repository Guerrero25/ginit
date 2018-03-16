var chalk = require("chalk");
var clear = require("clear");
var figlet = require("figlet");
var files = require("./lib/files");
var inquirer = require("./lib/inquirer");
var github = require("./lib/github");

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
    const token = await github.getStoredGithubToken();
    
    if (!token) {
        await github.setGithubCredentials();
        token = await github.registerNewToken();
    }

    console.log(token);
}

run();