const tmi = require('tmi.js')
const fetch = require('node-fetch')
const moment = require('moment');

const express = require('express');
const app = express();
const cors = require('cors');
const port = 3002;
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

app.use(cors())

const objMessage = { userState: "", messageBody: "" };

// tmi client that connects to the channel
const client = new tmi.Client(options)
client.connect();
// verify connection
client.on('connected', (address, port) => {
    client.action('gamemasterthompson', 'Hello, PubSubBot is now connected.')
})
    // interpret incoming messages
    .on('message', (channel, userstate, message, self) => {

        console.log("This is the message:", JSON.stringify(userstate))
        objMessage.messageBody = message
        objMessage.userState = userstate

        // look for command
        if (message.charAt(0) === "!") {
            // look for timer command
            if (message.split(' ')[0] === "!timer") {
                const firstArgument = message.split(' ')[1]
                const secondArgument = message.split(' ')[2]
                console.log(`!timer command executed: Command: ${message.split(' ')[0]} Region: ${firstArgument} SummonerName: ${secondArgument}`)
                timerCommand(firstArgument, secondArgument, message, channel);
            }
            if (message.split(' ')[0] === "!today") {
                const firstArgument = message.split(' ')[1]
                const secondArgument = message.split(' ')[2]
                console.log(`!today command executed: Command: ${message.split(' ')[0]} Region: ${firstArgument} SummonerName: ${secondArgument}`)
                todayCommand(firstArgument, secondArgument, message, channel);
            }
        }
        if (self) return;
        if (message.toLowerCase() === '!hello') {
            client.say(channel, `@${tags.username}, heya!`)
        }
    })
    .on('subscription', (channel, username, method, message, userstate) => {
        console.log(`
        
        
        You received a subscription! Here are the incoming data objects: 
        Username: ${username}
        
        Method: ${method}
        
        Message: ${message}
        
        Userstate: ${userstate}
        
        
        `)
    })
    .on('raided',(channel, username, viewers)=>{
        console.log(`
        
        
        You been raided! Here are the incoming data objects: 
        Username: ${username}
        
        Viewers: ${viewers}
        
        Channel: ${channel}
        
        
        
        `)
    })

const timerCommand = (region, argument, receivedMessage, channel) => {
    argument = encodeURIComponent(argument);

    if (argument.length > 0) {
        fetch(`http://localhost:3001/api/v1/timer/?summoner_name=${argument}&region=${region}`, {
            method: 'POST'
        })
            .then(r => r.json())
            // .then(r=> console.log(r))
            .then(response => {
                argument = decodeURIComponent(argument);
                responseHandler(response, receivedMessage, argument, channel);

            }
            )
            .catch(error => console.log('This is the error you received: ' + error));

    } else {
        client.say(channel, `I've received the timer command, but your parameters made no sense. Syntax is: "!timer <region> <summonername>`);
    }
};

const todayCommand = (region, argument, receivedMessage, channel) => {
    argument = encodeURIComponent(argument);
    console.log(`
    
    
    ${argument}
    
    
    `)
//https://fresh-under-one-sky-email-api.herokuapp.com/
    if (argument.length > 0) {
        client.say(channel, "...I have received your request and am processing it...")
        fetch(`http://localhost:3001/api/v1/today/?summoner_name=${argument}&region=${region}`, {
            method: 'POST'
        })
            .then(r => r.text())
            // .then(r=> console.log(r))
            .then(response => {
                response.replace(`"`,``).replace("[","").replace("]","")
                console.log(response)
                argument = decodeURIComponent(argument);
                todayResponseHandler(response, receivedMessage, argument, channel);

            }
            )
            .catch(error => {
                console.log('This is the error you received: ' + error)
                client.say(channel, "I've received your command but the server returned an error.")
        });

    } else {
        client.say(channel, `I've received the timer command, but your parameters made no sense. Syntax is: "!timer <region> <summonername>`);
    }
};

const responseHandler = (data, receivedMessage, argument, channel) => {
    if (data.grand_total_time === '00 hours 00 minutes and 00 seconds') {
        client.say(channel, `**Weekly Results for Summoner:** ${argument}\nThis summoner hasn't played any games this week.`);
    } else {
        client.say(channel,
            `**Weekly Results for Summoner:** ${argument}\n${handleToday(data)}\n${handleYesterday(data)}\n${handleMinusTwo(data)}\n${handleMinusThree(data)}\n${handleMinusFour(data)}\n${handleMinusFive(data)}\n${handleMinusSix(data)}
      \n**Time Played This Week:** ${data.grand_total_time}\n**Win Percentage:** ${winCount(data.grand_total_results)}%`
        );
    }
};

const todayResponseHandler = (data, receivedMessage, argument, channel) => {

    // results = {
    //     won:wonGames,
    //     lost:failGames, 
    //     total:totalGames,
    //     percent:percentage}
    let results = winCount(data)
    client.say(channel,`${argument}'s record today is ${results.won} - ${results.lost}, a ${results.percent}% win rate`)
    return
    if (data.grand_total_time == '00 hours 00 minutes and 00 seconds') {
        client.say(channel, `Today's Results for ${argument}: This summoner hasn't played any games today.`);
    } else {
        if (argument.toLowerCase() == "deusrektmachina") {
            argument = "gamema24Gmtoorah1"
        }
        client.say(channel,
            `${argument} has played for ${data.grand_total_time} today and won ${winCount(data.grand_total_results)}% of ${data.grand_total_results.length} games played.`
        );
    }
};

const handleToday = (data) => {
    if (data.today.total_time === '00 hours 00 minutes and 00 seconds') {
        return '**Today:** No games played.';
    } else {
        return `**Today:** Played for ${data.today.total_time} -- Won ${winCount(data.today.results)}% of total games played.`;
    }
};

const handleYesterday = (data) => {
    if (data.minus_one.total_time === '00 hours 00 minutes and 00 seconds') {
        return '**Yesterday:** No games played.';
    } else {
        return `**Yesterday:** ${data.minus_one.total_time} -- Won ${winCount(data.minus_one.results)}% of total games played.`;
    }
};

const handleMinusTwo = (data) => {
    if (data.minus_two.total_time === '00 hours 00 minutes and 00 seconds') {
        return `**${momentCommand(-2)}:** No games played.`;
    } else {
        return `**${momentCommand(-2)}:** ${data.minus_two.total_time} -- Won ${winCount(data.minus_two.results)}% of total games played`;
    }

};

const handleMinusThree = (data) => {
    if (data.minus_three.total_time === '00 hours 00 minutes and 00 seconds') {
        return `**${momentCommand(-3)}:** No games played.`;
    } else {
        return `**${momentCommand(-3)}:** ${data.minus_three.total_time} -- Won ${winCount(data.minus_three.results)}% of total games played`;
    }
};

const handleMinusFour = (data) => {
    if (data.minus_four.total_time === '00 hours 00 minutes and 00 seconds') {
        return `**${momentCommand(-4)}:** No games played.`;
    } else {
        return `**${momentCommand(-4)}:** ${data.minus_four.total_time} -- Won ${winCount(data.minus_four.results)}% of total games played`;
    }

};

const handleMinusFive = (data) => {
    if (data.minus_five.total_time === '00 hours 00 minutes and 00 seconds') {
        return `**${momentCommand(-5)}:** No games played.`;
    } else {
        return `**${momentCommand(-5)}:** ${data.minus_five.total_time} -- Won ${winCount(data.minus_five.results)}% of total games played`;
    }

};

const handleMinusSix = (data) => {
    if (data.minus_six.total_time === '00 hours 00 minutes and 00 seconds') {
        return `**${momentCommand(-6)}:** No games played.`;
    } else {
        return `**${momentCommand(-6)}:** ${data.minus_six.total_time} -- Won ${winCount(data.minus_six.results)}% of total games played`;
    }
};

const winCount = (data) => {
    
    data = data.split(",")
    const wonGames = data.filter(game => game.replace(`"`,``).replace(`"`,``).replace("[","").replace("]","") == `Win`).length
    const failGames = data.filter(game => game.replace(`"`,``).replace(`"`,``).replace("[","").replace("]","") == `Fail`).length
    const totalGames = data.length
    
    let percentage = wonGames / totalGames
    if (percentage){
        percentage = Math.floor(percentage*100)
    }
    else{ percentage = 0}

    console.log(percentage)
    const results = {
        won:wonGames,
        lost:failGames, 
        total:totalGames,
        percent:percentage}

    // if (percentage) {
    //     return Math.floor(percentage * 100);
    // } return '0';
    return results
};

const momentCommand = (value) => {
    const now = moment();
    console.log(now)
    let day = now.add(value, 'days').day();
    switch (day) {
        case 0:
            day = 'Sunday';
            break;
        case 1:
            day = 'Monday';
            break;
        case 2:
            day = 'Tuesday';
            break;
        case 3:
            day = 'Wednesday';
            break;
        case 4:
            day = 'Thursday';
            break;
        case 5:
            day = 'Friday';
            break;
        case 6:
            day = 'Saturday';
            break;
        default:
            day = 'Sunday';
    }
    console.log(day)
    return day;
};

app.get("/subs", (req, res) => {
    res.send(JSON.stringify(objMessage));
    res.end();
})

app.listen(port, () => console.log(`Subscriber monitor is listening on port ${port}!`))