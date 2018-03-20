var octokit = require("@octokit/rest")({
    timeout: 0, // 0 means no request timeout
    requestMedia: 'application/vnd.github.v3+json',
    headers: {
        'user-agent': 'octokit/rest.js v1.2.3' // v1.2.3 will be current version
    }
});
var configstore = require("configstore");
var pkg = require("../package.json");
var _ = require("lodash");
var cli = require("clui");
var Spinner = cli.Spinner;
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
        const status = new Spinner('Authenticating you, please wait', ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷']);
        status.start();

        await octokit.authorization.create({
            scopes: ['user', 'public_repo', 'repo', 'repo:status'],
            note: 'ginits, the command-line tool for initalizing Git repos'
        }).then(response => {
            status.message('Founding token, please wait');
            
            if (response.data.token) {
                conf.set('github.token', response.data.token);
                status.stop();
            } else {
                throw new Error("Missing Token", "Github token was not found in the response");
            }
        }).catch(err => {
            console.log('Error with the authentication', err);
        });

        return conf.get('github.token');
    },

    githubAuth: token => {
        octokit.authenticate({
            type: 'oauth',
            token: token
        });
    }
}