const tmi = require('tmi.js')
const axios = require('axios')

// required to connect to Twitch
const options = {
    options: { debug: true },
    connection: {
        cluster: 'aws',
        reconnect: true
    },
    identity: {
        username: 'PubSubBot',
        password: 'oauth:c1kv42il865ms9d8ooijyrv3ikzs73'
    },
    channels: ['gamemasterthompson']
}

// tmi client that connects to the channel
const client = new tmi.Client(options)
client.connect();
// verify connection
client.on('connected', (address, port) => {
    client.action('gamemasterthompson', 'Hello, PubSubBot is now connected.')
})
    // interpret incoming messages
    .on('message', (channel, tags, message, self) => {
        // look for command
        if (message.charAt(0) === "!") {
            // look for timer command
            if (message.split(' ')[0] === "!timer") {
                const firstArgument = message.split(' ')[1]
                const secondArgument = message.split(' ')[2]
                console.log(`!timer command executed: Command: ${message.split(' ')[0]} Region: ${firstArgument} SummonerName: ${secondArgument}`)
                timerCommand(firstArgument, secondArgument, message);
            }
        }
        if (self) return;
        if (message.toLowerCase() === '!hello') {
            client.say(channel, `@${tags.username}, heya!`)
        }
    })
    .on('subscription', (channel, username, method, message, userstate) => {
        console.log(username, method, message, userstate)
    })

const timerCommand = (region, argument, receivedMessage) => {
    argument = encodeURIComponent(argument);

    if (argument.length > 0) {
        axios.post(`http://localhost:3001/api/v1/timer/?summoner_name=${argument}&region=${region}`, {
            method: 'POST'
        })
            .then(r => r.json())
            .then(response => {
                argument = decodeURIComponent(argument);
                responseHandler(response, receivedMessage, argument);

            }
            )
            .catch(error => console.log('This is the error you received: ' + error));

    } else {
        receivedMessage.channel.send('The command was received, but this command requires an argument to function.');
    }
};