var _ = require("lodash");
var fs = require("fs");
var touch = require("touch");
var git = require("simple-git")();
var cli = require("clui");
var Spinner = cli.Spinner;

var inquirer = require("./inquirer");
var gh = require("./github");

module.exports = {
    createRemoteRepo: async (name, description) => {
        const github = gh.getInstance();
        const answers = await inquirer.askRepoDetails(name, description);

        const data = {
            name: answers.name,
            description: answers.description,
            private: (answers.visibility === 'private')
        };

        const status = new Spinner('Creating remote repository...');
        status.start();

        try {
            const response = await github.repos.create(data);
            return response.data.clone_url;
        } catch (err) {
            throw err;
        } finally {
            status.stop();
        }
    },

    createGitignore: async () => {
        const filelist = _.without(fs.readdirSync('.'), '.git', '.gitignore');

        if (filelist.length) {
            const answers = await inquirer.askIgnoreFiles(filelist);

            if (answers.ignore.length) {
                fs.writeFileSync('.gitignore', answers.ignore.join('\n'));
            } else {
                touch('.gitignore');
            }
        } else {
            touch('.gitignore');
        }
    },

    setupRepo: async url => {
        console.log('Initializing local repository and pushing to remote...\n');

        try {
            await git
                .init()
                .add('.gitignore')
                .add('./*')
                .commit('Initial Commit')
                .addRemote('origin', url)
                .push('origin', 'master');
            return true;
        } catch (err) {
            throw err;
        }
    }
}