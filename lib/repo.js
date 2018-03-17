var _ = require("lodash");
var fs = require("fs");
var git = require("simple-git")();
var cli = require("clui");
var spinner = cli.Spinner;

var inquirer = require("./inquirer");
var gh = require("./github");

module.exports = {
    createRemoteRepo: async () => {
        const github = gh.getInstance();
        const answers = await inquirer.askRepoDetails();

        const data = {
            name: answers.name,
            description: answers.description,
            private: (answers.visibility === 'private')
        };

        const status = new Spinner('Creating remote repository...');
        status.start();

        try {
            const response = await github.repos.create(data);
            return response.data.ssh_url;
        } catch (err) {
            throw err;
        } finally {
            status.stop();
        }
    }
}