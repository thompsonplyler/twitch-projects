const tmi = require('tmi.js')
const axios = require('axios')
const fetch = require('node-fetch')
const moment = require('moment');
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
    .on('message', (channel, userstate, message, self) => {

        console.log("This is the message:", JSON.stringify(userstate))
        
        // look for command
        if (message.charAt(0) === "!") {
            // look for timer command
            if (message.split(' ')[0] === "!timer") {
                const firstArgument = message.split(' ')[1]
                const secondArgument = message.split(' ')[2]
                console.log(`!timer command executed: Command: ${message.split(' ')[0]} Region: ${firstArgument} SummonerName: ${secondArgument}`)
                timerCommand(firstArgument, secondArgument, message, channel);
            }
            if (message.split(' ')[0] === "!today"){
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
            .catch(error=>console.log('This is the error you received: ' + error));
          
        } else {
          client.say(channel, `I've received the timer command, but your parameters made no sense. Syntax is: "!timer <region> <summonername>`);
        }
      };

      const todayCommand = (region, argument, receivedMessage, channel) => {
        argument = encodeURIComponent(argument);
      
        if (argument.length > 0) {
          fetch(`http://localhost:3001/api/v1/today/?summoner_name=${argument}&region=${region}`, {
            method: 'POST'
          })
            .then(r => r.json())
            // .then(r=> console.log(r))
            .then(response => {
              argument = decodeURIComponent(argument);
              todayResponseHandler(response, receivedMessage, argument, channel);
              
            }
            )
            .catch(error=>console.log('This is the error you received: ' + error));
          
        } else {
          client.say(channel, `I've received the timer command, but your parameters made no sense. Syntax is: "!timer <region> <summonername>`);
        }
      };

      const responseHandler = (data, receivedMessage, argument, channel) => {
        if (data.grand_total_time === '00 hours 00 minutes and 00 seconds') {
          client.say(channel, `**Weekly Results for Summoner:** ${argument}\nThis summoner hasn't played any games this week.`);
        } else{
          client.say(channel,
            `**Weekly Results for Summoner:** ${argument}\n${handleToday(data)}\n${handleYesterday(data)}\n${handleMinusTwo(data)}\n${handleMinusThree(data)}\n${handleMinusFour(data)}\n${handleMinusFive(data)}\n${handleMinusSix(data)}
      \n**Time Played This Week:** ${data.grand_total_time}\n**Win Percentage:** ${winCount(data.grand_total_results)}%`
          );
        }
      };

      const todayResponseHandler = (data, receivedMessage, argument, channel) => {
        if (data.grand_total_time == '00 hours 00 minutes and 00 seconds') {
          client.say(channel, `Today's Results for ${argument}: This summoner hasn't played any games today.`);
        } else{
            if (argument.toLowerCase() == "deusrektmachina"){
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
        if (data.minus_six.total_time === '00 hours 00 minutes and 00 seconds'){
          return `**${momentCommand(-6)}:** No games played.`;
        } else {
          return `**${momentCommand(-6)}:** ${data.minus_six.total_time} -- Won ${winCount(data.minus_six.results)}% of total games played`;
        }
      };
      
      const winCount = (data) => {
        const gameTotal = data.length;
        const wonGames = data.filter(game => game == 'Win').length;
        const percentage = wonGames / gameTotal;
      
        if (percentage) {
          return Math.floor(percentage * 100);
        } return '0';
      };

      const momentCommand = (value) => {
        const now = moment();
        console.log(now)
        let day = now.add(value,'days').day();
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

