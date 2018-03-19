var github = require("./github");

module.exports = {
    runGinit: async (name, description) => {
        let token = await github.getStoredGithubToken();
        
        if (!token) {
            await github.setGithubCredentials();
            token = await github.registerNewToken();
        }
    
        return token;
    }
}