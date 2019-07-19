exports.repo = (username, repoName) => { return "https://api.github.com/repos/" + username + "/" + repoName }
exports.user = (username) => { return "https://api.github.com/users/" + username }