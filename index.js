#!/usr/bin/env node

var chalk = require("chalk");
var clear = require("clear");
var figlet = require("figlet");
var program = require("commander");
var pkg = require("./package.json");
var files = require("./lib/files");
var commads = require("./lib/commads");

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

program
    .version(pkg.version, '-v, --version')
    .arguments('[name] [description]')
    .action(commads.run);

program
    .command('login')
    .action(commads.login);

program
    .command('logout')
    .action(commads.logout);

program.parse(process.argv);