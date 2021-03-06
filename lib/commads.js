var chalk = require("chalk");
var github = require("./github");
var repo = require("./repo");

const getGithubToken = async () => {
    let token = await github.getStoredGithubToken();
    
    if (!token) {
        console.log(chalk.red('Authentication no exists!'));
        process.exit();
    }

    return token;
}

module.exports = {
    run: async (name, description) => {
        try {
            const token = await getGithubToken();
            github.githubAuth(token);

            const url = await repo.createRemoteRepo(name, description);
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
    },

    login: async () => {
        const token = github.getStoredGithubToken();

        if (token) {
            console.log(chalk.red('Authentication already exists!'));
            process.exit();
        }

        await github.setGithubCredentials();
        await github.registerNewToken();

        console.log(chalk.green('Login succesfully!'));
    },

    logout: () => {
        const id = github.getStoredGithubId();

        if (!id) {
            console.log(chalk.red('Non-existent authentication! run ´ginit login´'))
            process.exit()
        }

        github.logout(id);
    }
}