require('dotenv').config({path: __dirname + '/.env'})
const tmi = require('tmi.js')
const fetch = require('node-fetch')
const moment = require('moment');

const express = require('express');
const app = express();
const cors = require('cors');
const io = require('socket.io-client')


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
        password: `${process.env.PUBSUBPASSWORD}`
    },
    channels: ['gamemasterthompson']
}



let goldState = true
let giveAwayEntriesArray = []
let giveAwayActive = false
let userExpenditures = {}

app.use(cors())

const objMessage = { userState: "", messageBody: "" };

// tmi client that connects to the channel
const client = new tmi.Client(options)
client.connect();
// verify connection
client.on('connected', (address, port) => {
    // client.action('gamemasterthompson', 'Hello, PubSubBot is now connected.')
})
    // interpret incoming messages
    .on('message', (channel, userstate, message, self) => {

        // console.log("This is the message:", `
        
        
        // ${JSON.stringify(userstate)}
        
        
        
        // `)
        let goldrewardNum = "09083718-497b-4c63-ac42-0d17f8f584e8"
        let noTop01RewardNum = "6c153086-4423-44f9-9aff-0420d7097ce5"
        let pureSkillRewardNum = "d4ac0590-b62c-48f0-9d57-ba4964f35d22"
        let youNeededMe = "c7ae41be-e924-4839-9589-f0e95545317b"
        let lurkerRewardNum = "00eeb6aa-e4cc-4395-9027-ac5c981a6441"
        let potionRewardNum = "e900e6de-5787-4f90-9520-99d44a6dc508"
        let gpRewardNum = "be6c7225-8487-44cd-8cfd-d0d1312f5e86"

        if(userstate["custom-reward-id"]==goldrewardNum){
            console.log(`Ya made it: ${goldrewardNum}`)
            if (goldState){
                goldSpend()
                }
            }

        if(userstate["custom-reward-id"]==noTop01RewardNum){
            console.log(`Ya made it: ${noTop01RewardNum}`)
                noTopEmit()
            }

        if(userstate["custom-reward-id"]==pureSkillRewardNum){
            console.log(`Ya made it: ${pureSkillRewardNum}`)
                pureSkillEmit()
                }
        
        if(userstate["custom-reward-id"]==youNeededMe){
            console.log(`Ya made it: ${youNeededMe}`)
                youNeedMeEmit()
                }

        if(userstate["custom-reward-id"]==lurkerRewardNum){
            console.log(`Ya made it: ${lurkerRewardNum}`)
                lurkerEmit()
                }
            
        if(userstate["custom-reward-id"]==potionRewardNum){
            console.log(`Ya made it: ${potionRewardNum}`)
                potionEmit()
                }

        if(userstate["custom-reward-id"]==gpRewardNum){
            console.log(`Ya made it: ${gpRewardNum}`)
                gpRewardHandler(userstate)
                }
                    
            

        objMessage.messageBody = message
        objMessage.userState = userstate

        if (message.charAt(0)==="1" && giveAwayActive && message.length===1){
            console.log("Entry recorded")
            contestEntryHandler(userstate)
        }

        // look for command
        if (message.charAt(0) === "!") {
            // look for timer command
            
            if (message.split(' ')[0] === "!today") {
                let firstArgument = message.split(' ')[1]
                let secondArgument = message.split(' ')[2]
                if (!firstArgument && !secondArgument){
                    firstArgument = "na"
                    secondArgument = "EveOnlyFans"
                }
                console.log(`
                
                
                Recorded region as ${firstArgument}
                
                
                `)
                console.log(`!today command executed: Command: ${message.split(' ')[0]} Region: ${firstArgument} SummonerName: ${secondArgument}`)
                todayCommand(firstArgument, secondArgument, message, channel);
            }

            if (message.split(' ')[0] === "!rank") {
                console.log(`!rank command executed`)
                rankCommand(message, channel);
            }

            if (message.split(' ')[0] === "!spend"){
                if (userstate.subscriber && giveAwayActive == true){
                    console.log(`!spend command executed`)

                    spendCheck(userstate,channel)
                }
                
                else if (!userstate.subscriber)
                {
                    console.log("Someone who ain't a subscriber tried to spend gold!")
                }
                else if (giveAwayActive == false){
                    console.log("Someone tried to spend gold outside a drawing!")
                }
            }
            
            // if (message.split(' ')[0]=== "!spendyourgold"){
            //     if (goldState){
            //     goldSpend()
            //     }
            //     else {
            //         client.say(channel, "Nice try, guy. That command was JUST used.")
            //     }

            // }
        }
        if (self) return;
        if (message.toLowerCase() === '!hello') {
            client.say(channel, `@${userstate.username}, heya!`)
        }

        if (message.toLowerCase() === '!gpcheck') {
            let gpResult = gpCheck(userstate, channel)
            // return gpResult
        }        
        
        if (message.toLowerCase() === '!giveawaydraw') {
            beginGiveAway(userstate, channel)
            // return gpResult
        }

        // if (message.split(' ')[0] === "!testing") {
        //     console.log("Test command received. Sending test message to Rails...")
        //     const userData = {"twitch_user": {"username": userstate.username}}
            
        //     const fetchConfig = { 
        //         method: 'POST',
        //         headers: { 
        //         "Content-Type": "application/json",
        //         "Accept": "application/json"},
        //         "body": JSON.stringify(userData)
        //         }
        //     fetch("http://fresh-under-one-sky-email-api.herokuapp.com/twitch_user_check", fetchConfig)
        //     .then(r=>r.json())
        //     .then(r=>console.log(r))
        // }


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
    .on('cheer',(channel, userstate, message)=>{
        console.log(`
        

        You have received a cheer! Here are the incoming data objects:
        Username: ${userstate}

        Channel: ${channel}

        Message: ${message}
        `)
    })

const todayCommand = (region, argument, receivedMessage, channel) => {
    argument = encodeURIComponent(argument);
    console.log(`
    
    
    ${argument}
    
    
    `)
//https://fresh-under-one-sky-email-api.herokuapp.com/
    if (argument.length > 0) {
        client.say(channel, "...I have received your request and am processing it...")
        fetch(`http://fresh-under-one-sky-email-api.herokuapp.com/api/v1/today/?summoner_name=${argument}&region=${region}`, {
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



const rankResponseHandler = (response) => {
    let parsedResponse = JSON.parse(response)
    const { summonerName, tier, rank, leaguePoints } = parsedResponse
    let stringResponse = `Thompson is currently ${tier} ${rank} with ${leaguePoints} LP.`
    console.log(stringResponse)
    return stringResponse
}

const rankCommand = (message,channel) => {
    fetch(`http://fresh-under-one-sky-email-api.herokuapp.com/api/v1/rank_lol/?summoner_name=EveOnlyFans&region=na`, {
        method: 'POST'
    })
        .then(r => r.text())
        // .then(r=> console.log(r))
        .then(response => {
            response.replace(`"`,``).replace("[","").replace("]","")
            
            let stringResponse = rankResponseHandler(response)
            client.say(channel, stringResponse)
            // argument = decodeURIComponent(argument);
            // todayResponseHandler(response, receivedMessage, argument, channel);

        }
        )
        .catch(error => {
            console.log('This is the error you received: ' + error)
            client.say(channel, "I've received your command but the server returned an error.")
    });
};


const todayResponseHandler = (data, receivedMessage, argument, channel) => {
    let results = winCount(data)
    client.say(channel,`${argument}'s record today is ${results.won} - ${results.lost}, a ${results.percent}% win rate`)
    return
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

    return results
};

app.get("/subs", (req, res) => {
    res.send(JSON.stringify(objMessage));
    res.end();
})

app.listen(port, () => console.log(`Subscriber monitor is listening on port ${port}!`))

// connects PubSub server to local socket.io server
const socket = io('http://localhost:3000');

// function to respond to !spendyourgold
const goldSpend = () => {
    socket.emit('gold')
}

const noTopEmit = () => {
    socket.emit('notop')
}

const pureSkillEmit = () => {
    socket.emit('pureskill')
}

const youNeedMeEmit = () => {
    socket.emit('youneedme')
}

const potionEmit = () => {
    socket.emit('potion')
}

const lurkerEmit = () => {
    socket.emit('lurker')
}

const resetGold = () => {
    goldState = false

    const resetGoldState = () => {
        goldState = true
        return
    }

    setTimeout(resetGoldState,15000)
    return 
}

const gpRewardHandler = (userstate) => {
    console.log(userstate.username)
    const userData = {"twitch_user": {"username": userstate.username}}
            
    const fetchConfig = { 
        method: 'POST',
        headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"},
        "body": JSON.stringify(userData)
        }
    fetch("http://fresh-under-one-sky-email-api.herokuapp.com/twitch_user_add_gp", fetchConfig)
    .then(r=>r.json())
    .then(r=>console.log(r))

    
}

const spendCheck = (userstate,channel) => {
    console.log(userstate.username)
    const userData = {"twitch_user": {"username": userstate.username}}
            
    const fetchConfig = { 
        method: 'POST',
        headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"},
        "body": JSON.stringify(userData)
    }

    fetch("http://fresh-under-one-sky-email-api.herokuapp.com/twitch_user_gp_check", fetchConfig)
    .then(r=>r.json())
    .then(r=>{
        console.log("results of gp check:", r)
        if (r.gp>0){

            if (userExpenditures.item && userExpenditures.item[userstate.username]){
                if (userExpenditures.item[userstate.username].spent < 5){
                console.log("This is userExpenditures!", userExpenditures)
                userExpenditures.item[userstate.username].spent += 1
                gpContestSpend(userstate,channel)
                }
                else {
                    client.say(channel, `@${userstate.username}, you have already spent your daily limit of gp!`);
                    return
                }
            }
            else {
                let item = {[userstate.username]:{spent: 1}}
                userExpenditures = {...userExpenditures, item}
                console.log("User Expensitures Array", userExpenditures)
                gpContestSpend(userstate,channel)
            }

            }
        
        else {
        client.say(channel, `@${userstate.username}, you do not currently have any gp to spend!`);
        }
    })

}

const gpCheck = (userstate, channel) => {
    console.log(userstate.username)
    const userData = {"twitch_user": {"username": userstate.username}}
            
    const fetchConfig = { 
        method: 'POST',
        headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"},
        "body": JSON.stringify(userData)
        }
    fetch("http://fresh-under-one-sky-email-api.herokuapp.com/twitch_user_gp_check", fetchConfig)
    .then(r=>r.json())
    .then(r=>{
        client.say(channel, `@${userstate.username}, you currently have ${r.gp?r.gp:0} gp.`);
        
    })

    
}

const beginGiveAway = (userstate,channel) => {
    if (userstate.username === "gamemasterthompson"){
        client.action('gamemasterthompson','Giveaway has started!')
        client.action('gamemasterthompson','For the next 60 seconds, you can type "1" in the chat to enter drawing for free RP!')
        client.action('gamemasterthompson','Subscribers can type !spend <number> to use gp.')
        client.action('gamemasterthompson', `Every gp spent counts as an additional entry for the giveaway. (Max 5 per day!)`);
        client.action('gamemasterthompson', `If there are not ten separate participants, there will be no drawing! `);
        giveAwayActive = true

        setTimeout((userstate,channel)=>{
            giveAwayActive = false
            console.log(giveAwayEntriesArray)
            client.action('gamemasterthompson', `Entry time has ended. Drawing will now commence.`);
            contestDrawingHandler()
        },20000)

        
    }
    else {
        client.say(channel, `Sorry, you don't have the authorization to use this command!`);
    }
    

}

const contestDrawingHandler = () => {
    let winner = random_item(giveAwayEntriesArray)
    console.log(`The winner is ${winner}`)
    giveAwayEntriesArray = []
    userExpenditures = {}
}

const gpContestSpend = (userstate, channel) => {
    console.log(userstate.username)
    const userData = {"twitch_user": {"username": userstate.username}}
            
    const fetchConfig = { 
        method: 'POST',
        headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"},
        "body": JSON.stringify(userData)
        }
    fetch("http://fresh-under-one-sky-email-api.herokuapp.com/twitch_user_contest_gp_spend", fetchConfig)
    .then(r=>r.json())
    .then(r=>{
        let user = userstate.username
        giveAwayEntriesArray.push(user)
        console.log("How much was spent?", userExpenditures.item[userstate.username].spent + 
    "gp")
        client.say(channel, `@${userstate.username} has thrown a gold coin toward the drawing!`);
        
    })

    
}

const contestEntryHandler = (userstate) => {
    const user = userstate.username
    let valid = giveAwayEntriesArray.filter(item=>item==user)
    if (valid.length == 0){
        console.log("User not previously detected. User entered into drawing!")
        giveAwayEntriesArray.push(user)
    }
    else {
        console.log("User had already entered drawing and cannot do so again.")
        return
    }
    // console.log("giveawayEntryHandler username:", userstate.username)
    // const userData = {"twitch_user": {"username": userstate.username}}
            
    // const fetchConfig = { 
    //     method: 'POST',
    //     headers: { 
    //     "Content-Type": "application/json",
    //     "Accept": "application/json"},
    //     "body": JSON.stringify(userData)
    //     }
    // fetch("http://fresh-under-one-sky-email-api.herokuapp.com/twitch_giveaway_entry", fetchConfig)
    // .then(r=>r.json())
    // .then(r=>{
    //     client.say(channel, `Contest entry received.`);
        
    // })
}

function random_item(items)
{
  
return items[Math.floor(Math.random()*items.length)];
     
}