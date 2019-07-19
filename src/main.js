const requestify = require('requestify');
const endpoints = require("./globals/endpoints.js")
const fields = require("./globals/fields.js")
const username = "riprr"

main()

async function main() {
    console.log(await getCards("citibiker", "songRater"))
}

async function getCards(...repoNames) {
    let promises = [makeCard("user", username)]
    for (let repo of repoNames) {
        let repoCard = makeCard("repo", repo)
        promises.push(repoCard)
    }
    return await Promise.all(promises)
}

async function makeCard(type, repoName) {
    const urlsToConvert = fields.conversions;
    const url = endpoints[type].call(this, username, repoName)
    const cardFields = fields[type]
    const response = await get(url)
    let card = {}
    let finishedCard = {}
    for (let field of cardFields) {
        if (urlsToConvert.includes(field)) {
            const newFieldName = field.substring(0, field.indexOf("_"))
            card[newFieldName] = await convertField(response[field])
        }
        card[field] = response[field]
    }
    finishedCard[repoName] = card
    return finishedCard
}

async function get(url) {
    let response = new Promise((resolve, reject) => {
        requestify.get(url)
            .then(res => {
                resolve(res.getBody())
            })
            .catch(err => { console.log(err.getBody()) })
    })
    return await response
}

async function convertField(url) {
    if (url.includes("{"))
        url = url.substring(0, url.indexOf("{"))
    return await get(url)
}