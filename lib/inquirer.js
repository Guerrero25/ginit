var inquirer = require("inquirer");
var files =require("./files");

module.exports = {
    askGithubCredentials: () => {
        const questions = [
            {
                name: 'username',
                type: 'input',
                message: 'Enter your Github username or e-mail address:',
                validate: value => {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your username or e-maiil address:'
                    }
                }
            },
            {
                name: 'password',
                type: 'password',
                message: 'Enter your password:',
                validate: value => {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your password'
                    }
                }
            }
        ];

        return inquirer.prompt(questions);
    },

    askRepoDetails: (name, description) => {
        const questions = [
            {
                type: 'input',
                name: 'name',
                message: 'Enter a name  for the repository: ',
                default: name || files.getCurrentDirectoryBase(),
                validate: value => {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter a name for the repository: '
                    }
                }
            },
            {
                type: 'input',
                name: 'description',
                message: 'Opcionally enter a description of the repository: ',
                default: description || null
            },
            {
                type: 'list',
                name: 'visibility',
                message: 'Public or private: ',
                choices: [ 'public', 'private' ],
                default: 'public'
            }
        ];

        return inquirer.prompt(questions);
    },

    askIgnoreFiles: filelist => {
        const questions = [
            {
                type: 'checkbox',
                name: 'ignore',
                message: 'Select the files and/or folders yoou wish ignore: ',
                choices: filelist,
                default: ['node_modules']
            }
        ];

        return inquirer.prompt(questions);
    }
}