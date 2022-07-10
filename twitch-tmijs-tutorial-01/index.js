const tmi = require('tmi.js');
require('dotenv').config({path: __dirname + '/.env'})


const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true
  },
  channels: [ 'gamemasterthompson' ]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
  // This will tell the bot to ignore echoed messages.
  if(self) return;

  if(message.toLowerCase() === '!marco') {
    client.say(channel, `Polo!`);
  }
});