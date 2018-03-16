var octokit = require("@octokit/rest");
var configstore = require("configstore");
var pkg = require("../package.json");
var _ = require("lodash");
var cli = require("clui");
var spinner = cli.spinner;
var chalk = require("chalk");

var inquirer = require("./inquirer");

var conf = new configstore(pkg.name);

module.exports = {
    getInstance: () => {
        return octokit;
    },

    getStoredGithubToken: () => {
        return conf.get('github.token');
    },

    setGithubCredentials: async () => {
        const credentials = await inquirer.askGithubCredentials();
        
        octokit.authenticate(
            _.extend(
                {
                    type: 'basic'
                },
                credentials
            )
        );
    },

    registerNewToken: async () => {
        const status = new spinner('Authenticating you, please wait');
        status.start();

        try {
            const response = octokit.authorization.create({
                scopes: ['user', 'public_repo', 'repo', 'repo:status'],
                note: 'ginits, the command-line tool for initalizing Git repos'
            });

            const token = response.data.token;

            if (token) {
                conf.set('github.token', token);
                return token;
            } else {
                throw new Error("Missing Token", "Github token was not found in the response");
            }
        } catch (err) {
            throw err;
        } finally {
            status.stop();
        }
    }
}