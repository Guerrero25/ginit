var chalk = require("chalk");
var github = require("./github");
var repo = require("./repo");

const getGithubToken = async () => {
    let token = await github.getStoredGithubToken();
    
    if (!token) {
        await github.setGithubCredentials();
        token = await github.registerNewToken();
    }

    return token;
}

module.exports = {
    run: async (name, description) => {
        try {
            const token = await getGithubToken();
            github.githubAuth(token);

            const url = await repo.createRemoteRepo();
            await repo.createGitignore();
            const done = await repo.setupRepo(url);

            if (done) {
                console.log(chalk.green('Ginit Success!'));
            }
        } catch (err) {
            switch (err.code) {
                case 401:
                    console.log(chalk.red('Couldn\'t log you in. Please provide correct credentials/token.'));
                    break;
                case 422:
                    console.log(chalk.red('There already exists a remote repository with the same name'));
                    break;
                default:
                    console.log(err);
            }
        }
    }
}