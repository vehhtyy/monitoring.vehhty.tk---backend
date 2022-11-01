const fetch = require('node-fetch');
const config = require('config');

const clientId = config.get('clientId')
const clientSecret = config.get('clientSecret')

let OAuth = {}

async function getOAuth() {
    try {
        const res = await fetch('https://id.twitch.tv/oauth2/token', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
                'client_id': clientId,
                'client_secret': clientSecret,
                'grant_type': 'client_credentials'
            })
        })

        if (res.status >= 400) {
            throw new Error("Bad response from server");
        }
        const json = await res.json()
        OAuth = json
        console.log('OAuth has been generated')
    }
    catch (error) {
        console.log(error)
    }
}


async function getVievers(streamerList) {
    let query = ''
    for (streamerName of streamerList) {
        query = 'user_login=' + streamerName + '&' + query
    }
    
    try {
        const res = await fetch('https://api.twitch.tv/helix/streams?' + query, { method: 'GET', headers: { 'Authorization': 'Bearer ' + OAuth.access_token, 'Client-Id': clientId } })
        const json = await res.json()
        return json.data
    }
    catch (error) {
        console.log(error)
    }
}

async function getChatters(userLogin) {
    try {
        const res = await fetch('https://tmi.twitch.tv/group/user/' + userLogin + '/chatters', { method: 'GET' })
        const json = await res.json()
        let date = new Date().toISOString()
        return { 'currentChatters': json.chatter_count, 'time': date }
    }
    catch (error) {
        console.log(error)
    }
}

async function getUserImg(userLogin) {
    try {
        const res = await fetch('https://api.twitch.tv/helix/users?login=' + userLogin, { method: 'GET', headers: { 'Authorization': 'Bearer ' + OAuth.access_token, 'Client-Id': clientId } })
        const json = await res.json()
        return json.data[0].profile_image_url
    }
    catch (error) {
        console.log(error)
    }
}

module.exports = { getOAuth, getChatters, getUserImg, getVievers }



