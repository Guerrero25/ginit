var chalk = require("chalk");
var clear = require("clear");
var figlet = require("figlet");
var files = require("./lib/files");

clear();
console.log(
    chalk.yellow(
        figlet.textSync('Ginit', {horizontalLayout: 'full'})
    )
);