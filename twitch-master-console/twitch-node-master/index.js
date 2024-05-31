const express = require("express");
const app = express();
const cors = require("cors");
const io = require("socket.io-client");
const keys = require("global-keys");
const moment = require("moment");
const socket = io("http://localhost:3000");
const tmi = require("tmi.js");
const constants = require("./constants");
const config = require("./config");
let tabState = { tab: false };

require("dotenv").config();

const { TMIJS_PORT, PUBSUBPASSWORD, API_KEY, SOCKET_PORT } = constants;

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const tmiApp = app.listen(TMIJS_PORT, () => {
  console.log("tmiApp has loaded on port 3337.");
});

// TMIJS server

const tmiClient = new tmi.Client(config.tmi);
tmiClient.connect();
tmiClient
  .on("connected", (address, port) => {
    console.log("TMI Client is now connected to Twitch.\n");
  })
  .on("message", (channel, userstate, message, self) => {
    // console.log("This is the message:", `

    // ${JSON.stringify(userstate)}

    // `)

    // reward codes for various channel inputs
    //spend your gold
    let goldrewardNum = "09083718-497b-4c63-ac42-0d17f8f584e8";
    //top lane is sad
    let noTop01RewardNum = "6c153086-4423-44f9-9aff-0420d7097ce5";

    // pure skill animation
    let pureSkillRewardNum = "d4ac0590-b62c-48f0-9d57-ba4964f35d22";

    //you needed me animation
    let youNeededMe = "c7ae41be-e924-4839-9589-f0e95545317b";

    // lurker animation
    let lurkerRewardNum = "00eeb6aa-e4cc-4395-9027-ac5c981a6441";

    // potions prompt animation
    let potionRewardNum = "e900e6de-5787-4f90-9520-99d44a6dc508";

    // add coins to backend
    let gpRewardNum = "be6c7225-8487-44cd-8cfd-d0d1312f5e86";

    // looking for custom reward usually refers to the socket that will fire..
    // spend your gold
    if (userstate["custom-reward-id"] == goldrewardNum) {
      console.log(`Ya made it: ${goldrewardNum}`);
      if (goldState) {
        goldSpend();
      }
    }

    // top lane is sad
    if (userstate["custom-reward-id"] == noTop01RewardNum) {
      console.log(`Ya made it: ${noTop01RewardNum}`);
      noTopEmit();
    }

    // pure skill
    if (userstate["custom-reward-id"] == pureSkillRewardNum) {
      console.log(`Ya made it: ${pureSkillRewardNum}`);
      pureSkillEmit();
    }
    // you needed me
    if (userstate["custom-reward-id"] == youNeededMe) {
      console.log(`Ya made it: ${youNeededMe}`);
      youNeedMeEmit();
    }

    // lurker animation
    if (userstate["custom-reward-id"] == lurkerRewardNum) {
      console.log(`Ya made it: ${lurkerRewardNum}`);
      lurkerEmit();
    }

    // potion animation
    if (userstate["custom-reward-id"] == potionRewardNum) {
      console.log(`Ya made it: ${potionRewardNum}`);
      potionEmit();
    }

    // stash one gp. -- NOT an on-screen animation!
    if (userstate["custom-reward-id"] == gpRewardNum) {
      console.log(`Ya made it: ${gpRewardNum}`);
      gpRewardHandler(userstate);
    }

    objMessage.messageBody = message;
    objMessage.userState = userstate;

    // if a user enters 1 and only 1 in the Twitch chat
    if (message.charAt(0) === "1" && giveAwayActive && message.length === 1) {
      console.log("Entry recorded");
      contestEntryHandler(userstate);
    }

    // look for command
    if (message.charAt(0) === "!") {
      // look for timer command
      // reports the day's record with a call to the backend
      if (message.split(" ")[0] === "!today") {
        // region
        let firstArgument = message.split(" ")[1];

        // username
        let secondArgument = message.split(" ")[2];
        // set defaults, i.e. no parameters supplied
        if (!firstArgument && !secondArgument) {
          firstArgument = "na";
          secondArgument = "EveOnlyFans";
        }
        console.log(
          `!today command executed: Command: ${
            message.split(" ")[0]
          } Region: ${firstArgument} SummonerName: ${secondArgument}`
        );
        // the command to actually spit back the results
        todayCommand(firstArgument, secondArgument, message, channel);
      }

      // fetch rank and lp
      if (message.split(" ")[0] === "!rank") {
        console.log(`!rank command executed`);
        rankCommand(message, channel);
      }

      // special command to for darthfrodious websocket
      if (
        message.split(" ")[0] === "!specialneeds" &&
        userstate.username.toLowerCase() == "darthfrodious"
      ) {
        console.log(`!specialneeds command executed`);
        specialNeedsHandler(message, channel);
      }

      //
      //
      // gold spend commmand
      //
      //
      //
      //

      if (message.split(" ")[0] === "!spend") {
        // only subscribers can spend gold and only during active giveaways
        if (userstate.subscriber && giveAwayActive == true) {
          // how much are they spending
          let gpAmount = message.split(" ")[1];
          spendCheck(userstate, channel, gpAmount);
        }
        // not a subscriber
        else if (!userstate.subscriber) {
          console.log("Someone who ain't a subscriber tried to spend gold!");
          client.action(
            "gamemasterthompson",
            `Sorry, @${userstate.username}, only subscribers can use gp to enter drawings.`
          );
        }
        // no giveaway active
        else if (giveAwayActive == false) {
          console.log("Someone tried to spend gold outside a drawing!");
          client.action(
            "gamemasterthompson",
            `You can only spend gold during giveaways, @${userstate.username}.`
          );
        }
      }
    }
    // no idea
    if (self) return;

    // check on backend to see current gold
    if (message.split(" ")[0].toLowerCase() === "!gpcheck") {
      if (checkIfMe(userstate)) {
        let firstArgument = message.split(" ")[1];
        if (firstArgument) {
          let gpResult = adminGpCheck(userstate, channel, firstArgument);
          return;
        }
      }

      let gpResult = gpCheck(userstate, channel);
    }

    // start the giveaway
    if (message.toLowerCase() === "!giveawaydraw") {
      beginGiveAway(userstate, channel);
    }

    if (message.split(" ")[0] === "!gpadd" && checkIfMe(userstate)) {
      // region
      console.log("Found me");
      let firstArgument = message.split(" ")[1];
      console.log("Here's the name: ", firstArgument);

      // username
      let secondArgument = message.split(" ")[2];
      console.log("And here's the gold!", secondArgument);
      // set defaults, i.e. no parameters supplied
      addGold(firstArgument, secondArgument);
    }

    if (message.split(" ")[0] === "!gpsub" && checkIfMe(userstate)) {
      // region
      console.log("Found me");
      let firstArgument = message.split(" ")[1];
      console.log("Here's the name: ", firstArgument);

      // username
      let secondArgument = message.split(" ")[2];
      console.log("And here's the gold!", secondArgument);
      // set defaults, i.e. no parameters supplied
      addGold(firstArgument, secondArgument * -1);
    }
  })

  // sample event listeners for subscriptions
  .on("subscription", (channel, username, method, message, userstate) => {
    console.log(`
        
        
        You received a subscription! Here are the incoming data objects: 
        Username: ${username}
        
        Method: ${method}
        
        Message: ${message}
        
        Userstate: ${userstate}
        
        
        `);
  })

  // sample event listeners for raids
  .on("raided", (channel, username, viewers) => {
    console.log(`
        
        
        You been raided! Here are the incoming data objects: 
        Username: ${username}
        
        Viewers: ${viewers}
        
        Channel: ${channel}
        
        
        
        `);
  })

  // sample event listeners for cheers
  .on("cheer", (channel, userstate, message) => {
    console.log(`
        

        You have received a cheer! Here are the incoming data objects:
        Username: ${userstate}

        Channel: ${channel}

        Message: ${message}
        `);
  });

// Websocket Server

// Websocket client

// LoL Live Server

const socketApp = app.listen(SOCKET_PORT, () => {
  console.log("socketApp has loaded on port 3338");
});

return;
require("dotenv").config({ path: __dirname + "/.env" });

const io_2 = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const port_2 = 3002;
// required to connect to Twitch
const options = {
  options: { debug: true },
  connection: {
    cluster: "aws",
    reconnect: true,
  },
  identity: {
    username: "PubSubBot",
    password: `${process.env.PUBSUBPASSWORD}`,
  },
  channels: ["gamemasterthompson"],
};

const environments = {
  local: "http://localhost:3001",
  remote: "http://fresh-under-one-sky-email-api.herokuapp.com",
};

const currentEnvironment = environments.remote;
// const { Server } = require("socket.io");

const state = {
  gameStarted: false,
  gameEnded: false,
  hitSix: false,
  gotRabadons: false,
  gotHextech: false,
};

const keyStream = new keys.KeyStream();

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.use(express.static(__dirname));

setInterval(async () => {
  // let response = await axios(config);
  // let meCheck = response.data.filter((player) => {
  //   player.summonerName == "FinalBossEvelynn";
  // });
  const playerListURL = "https://127.0.0.1:2999/liveclientdata/playerlist";
  const eventConfigURL = "https://127.0.0.1:2999/liveclientdata/eventdata";
  const playerAbilitiesURL =
    "https://127.0.0.1:2999/liveclientdata/activeplayerabilities";
  const playerItemsURL =
    "https://127.0.0.1:2999/liveclientdata/playeritems?summonerName=FinalBossEvelynn";
  const activePlayerURL = "https://127.0.0.1:2999/liveclientdata/activeplayer";

  let eventResponse = await hitLocalAPI(eventConfigURL);
  let itemResponse = await hitLocalAPI(playerItemsURL);
  let abilityResponse = await hitLocalAPI(playerAbilitiesURL);
  let playerResponse = await hitLocalAPI(activePlayerURL);
  let currentLevel = playerResponse.level;

  //   let evelynnCheck =
  //     meCheck &&
  //     response.data.filter((player) => {
  //       player.championName = "Evelynn";
  //     });
  //   console.log(evelynnCheck ? "Foundya!" : "Nope!");
  //   1000;

  if (!eventResponse.Events) {
    console.log(
      "Unable to contact League Live Game API or game has not started."
    );
    state.gameStarted = false;
    state.gameEnded = false;
    state.hitSix = false;
    state.gotRabadons = false;
    state.gotHextech = false;
  }

  if (eventResponse.Events) {
    eventResponse.Events.forEach((event) => {
      if (state.gameEnded == false && event.EventName == "GameEnd") {
        state.gameEnded = true;
        console.log("The game has ended.");
      }

      if (state.gameStarted == false && event.EventName == "GameStart") {
        state.gameStarted = true;
        console.log("The game has started.");
      }
    });

    itemResponse.forEach((item) => {
      if (
        !state.gotRabadons &&
        (item.itemID == 3089 || item.displayName == "Rabadon's Deathcap") &&
        state.gameEnded == false
      ) {
        console.log("You got your Rabadons");
        socket.emit("rabadon");
        state.gotRabadons = true;
      }

      if (
        !state.gotHextech &&
        item.itemID == 3152 &&
        state.gameEnded == false
      ) {
        console.log("You got your hextech!");
        socket.emit("hextech");
        state.gotHextech = true;
      }
    });

    if (currentLevel == 6 && !state.hitSix && state.gameEnded == false) {
      console.log("You hit 6!");
      socket.emit("villain");
      state.hitSix = true;
    }
  }
}, 1000);

const hitLocalAPI = async (url) => {
  const axios = require("axios");
  var config = {
    method: "get",
    url,
  };
  try {
    let response = await axios(config);
    return response.data;
  } catch (e) {
    return (response = e);
  }
};

//////////
////////// Input checker
//////////

app.use(cors());
keyStream.on("data", (state) => {
  if (state.includes(81)) {
    counters["q"]++;
  }
});

app.get("/counters", (req, res) => {
  res.send(JSON.stringify(counters));
  res.end();
});

app.get("/tabstate", (req, res) => {
  res.send(JSON.stringify(tabState));
  res.end();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

///////
///////
///////

let server = app.listen(3000);

// const { Server } = require("socket.io");

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.use(express.static(__dirname));

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("gold", () => {
    console.log("Command 'gold' got to the server.");
    io.emit("gold");
  });

  socket.on("rabadon", () => {
    console.log("Command 'rabadon' got to the server.");
    io.emit("rabadon");
  });

  socket.on("hextech", () => {
    console.log("Command 'hextech' got to the server.");
    io.emit("hextech");
  });

  socket.on("villain", () => {
    console.log("Command 'villain' got to the server.");
    io.emit("villain");
  });

  socket.on("notop", () => {
    console.log("Command 'notop' got to the server.");
    io.emit("notop");
  });

  socket.on("pureskill", () => {
    console.log("Command 'pureskill' got to the server.");
    io.emit("pureskill");
  });

  socket.on("youneedme", () => {
    console.log("Command 'youneedme' got to the server.");
    io.emit("youneedme");
  });

  socket.on("potion", () => {
    console.log("Command 'potion' got to the server.");
    io.emit("potion");
  });

  socket.on("lurker", () => {
    console.log("Command 'lurker' got to the server.");
    io.emit("lurker");
  });

  socket.on("specialneeds", () => {
    console.log("Command 'specialneeds' got to the server.");
    io.emit("specialneeds");
  });
});

///////
/////// Pubsub
///////

// required to connect to Twitch
const twitchOptions = {
  options: { debug: true },
  connection: {
    cluster: "aws",
    reconnect: true,
  },
  identity: {
    username: "PubSubBot",
    password: `${process.env.PUBSUBPASSWORD}`,
  },
  channels: ["gamemasterthompson"],
};

let goldState = true;
// array to collect Twitch users who enter on /giveawaydraw
let giveAwayEntriesArray = [];

// state for giveaway. Set by /giveawaydraw in Twich chat, ended through setTimeout.
let giveAwayActive = false;

// collects user expenditures; cleared by setTimeout that ends the giveaway
let userExpenditures = {};

app.use(cors());

const objMessage = { userState: "", messageBody: "" };

// tmi client that connects to the channel
const client = new tmi.Client(options);
client.connect();

client.on("message", (channel, tags, message, self) => {
  // This will tell the bot to ignore echoed messages.
  if (self) return;

  if (message.toLowerCase() === "!marco") {
    let thing = basicFetch();
  }
});

const basicFetch = async (channel) => {
  const url = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/EveOnlyFans?api_key=${process.env.API_KEY}`;

  let result = await fetch(url);
  result = await result.text();
  console.log(result);
};

// verify connection
client
  .on("connected", (address, port) => {
    // client.action('gamemasterthompson', 'Hello, PubSubBot is now connected.')
  })
  // interpret incoming messages
  .on("message", (channel, userstate, message, self) => {
    // console.log("This is the message:", `

    // ${JSON.stringify(userstate)}

    // `)

    // reward codes for various channel inputs
    //spend your gold
    let goldrewardNum = "09083718-497b-4c63-ac42-0d17f8f584e8";
    //top lane is sad
    let noTop01RewardNum = "6c153086-4423-44f9-9aff-0420d7097ce5";

    // pure skill animation
    let pureSkillRewardNum = "d4ac0590-b62c-48f0-9d57-ba4964f35d22";

    //you needed me animation
    let youNeededMe = "c7ae41be-e924-4839-9589-f0e95545317b";

    // lurker animation
    let lurkerRewardNum = "00eeb6aa-e4cc-4395-9027-ac5c981a6441";

    // potions prompt animation
    let potionRewardNum = "e900e6de-5787-4f90-9520-99d44a6dc508";

    // add coins to backend
    let gpRewardNum = "be6c7225-8487-44cd-8cfd-d0d1312f5e86";

    // looking for custom reward usually refers to the socket that will fire..
    // spend your gold
    if (userstate["custom-reward-id"] == goldrewardNum) {
      console.log(`Ya made it: ${goldrewardNum}`);
      if (goldState) {
        goldSpend();
      }
    }

    // top lane is sad
    if (userstate["custom-reward-id"] == noTop01RewardNum) {
      console.log(`Ya made it: ${noTop01RewardNum}`);
      noTopEmit();
    }

    // pure skill
    if (userstate["custom-reward-id"] == pureSkillRewardNum) {
      console.log(`Ya made it: ${pureSkillRewardNum}`);
      pureSkillEmit();
    }
    // you needed me
    if (userstate["custom-reward-id"] == youNeededMe) {
      console.log(`Ya made it: ${youNeededMe}`);
      youNeedMeEmit();
    }

    // lurker animation
    if (userstate["custom-reward-id"] == lurkerRewardNum) {
      console.log(`Ya made it: ${lurkerRewardNum}`);
      lurkerEmit();
    }

    // potion animation
    if (userstate["custom-reward-id"] == potionRewardNum) {
      console.log(`Ya made it: ${potionRewardNum}`);
      potionEmit();
    }

    // stash one gp. -- NOT an on-screen animation!
    if (userstate["custom-reward-id"] == gpRewardNum) {
      console.log(`Ya made it: ${gpRewardNum}`);
      gpRewardHandler(userstate);
    }

    objMessage.messageBody = message;
    objMessage.userState = userstate;

    // if a user enters 1 and only 1 in the Twitch chat
    if (message.charAt(0) === "1" && giveAwayActive && message.length === 1) {
      console.log("Entry recorded");
      contestEntryHandler(userstate);
    }

    // look for command
    if (message.charAt(0) === "!") {
      // look for timer command
      // reports the day's record with a call to the backend
      if (message.split(" ")[0] === "!today") {
        // region
        let firstArgument = message.split(" ")[1];

        // username
        let secondArgument = message.split(" ")[2];
        // set defaults, i.e. no parameters supplied
        if (!firstArgument && !secondArgument) {
          firstArgument = "na";
          secondArgument = "EveOnlyFans";
        }
        console.log(
          `!today command executed: Command: ${
            message.split(" ")[0]
          } Region: ${firstArgument} SummonerName: ${secondArgument}`
        );
        // the command to actually spit back the results
        todayCommand(firstArgument, secondArgument, message, channel);
      }

      // fetch rank and lp
      if (message.split(" ")[0] === "!rank") {
        console.log(`!rank command executed`);
        rankCommand(message, channel);
      }

      // special command to for darthfrodious websocket
      if (
        message.split(" ")[0] === "!specialneeds" &&
        userstate.username.toLowerCase() == "darthfrodious"
      ) {
        console.log(`!specialneeds command executed`);
        specialNeedsHandler(message, channel);
      }

      //
      //
      // gold spend commmand
      //
      //
      //
      //

      if (message.split(" ")[0] === "!spend") {
        // only subscribers can spend gold and only during active giveaways
        if (userstate.subscriber && giveAwayActive == true) {
          // how much are they spending
          let gpAmount = message.split(" ")[1];
          spendCheck(userstate, channel, gpAmount);
        }
        // not a subscriber
        else if (!userstate.subscriber) {
          console.log("Someone who ain't a subscriber tried to spend gold!");
          client.action(
            "gamemasterthompson",
            `Sorry, @${userstate.username}, only subscribers can use gp to enter drawings.`
          );
        }
        // no giveaway active
        else if (giveAwayActive == false) {
          console.log("Someone tried to spend gold outside a drawing!");
          client.action(
            "gamemasterthompson",
            `You can only spend gold during giveaways, @${userstate.username}.`
          );
        }
      }
    }
    // no idea
    if (self) return;

    // check on backend to see current gold
    if (message.split(" ")[0].toLowerCase() === "!gpcheck") {
      if (checkIfMe(userstate)) {
        let firstArgument = message.split(" ")[1];
        if (firstArgument) {
          let gpResult = adminGpCheck(userstate, channel, firstArgument);
          return;
        }
      }

      let gpResult = gpCheck(userstate, channel);
    }

    // start the giveaway
    if (message.toLowerCase() === "!giveawaydraw") {
      beginGiveAway(userstate, channel);
    }

    if (message.split(" ")[0] === "!gpadd" && checkIfMe(userstate)) {
      // region
      console.log("Found me");
      let firstArgument = message.split(" ")[1];
      console.log("Here's the name: ", firstArgument);

      // username
      let secondArgument = message.split(" ")[2];
      console.log("And here's the gold!", secondArgument);
      // set defaults, i.e. no parameters supplied
      addGold(firstArgument, secondArgument);
    }

    if (message.split(" ")[0] === "!gpsub" && checkIfMe(userstate)) {
      // region
      console.log("Found me");
      let firstArgument = message.split(" ")[1];
      console.log("Here's the name: ", firstArgument);

      // username
      let secondArgument = message.split(" ")[2];
      console.log("And here's the gold!", secondArgument);
      // set defaults, i.e. no parameters supplied
      addGold(firstArgument, secondArgument * -1);
    }
  })

  // sample event listeners for subscriptions
  .on("subscription", (channel, username, method, message, userstate) => {
    console.log(`
        
        
        You received a subscription! Here are the incoming data objects: 
        Username: ${username}
        
        Method: ${method}
        
        Message: ${message}
        
        Userstate: ${userstate}
        
        
        `);
  })

  // sample event listeners for raids
  .on("raided", (channel, username, viewers) => {
    console.log(`
        
        
        You been raided! Here are the incoming data objects: 
        Username: ${username}
        
        Viewers: ${viewers}
        
        Channel: ${channel}
        
        
        
        `);
  })

  // sample event listeners for cheers
  .on("cheer", (channel, userstate, message) => {
    console.log(`
        

        You have received a cheer! Here are the incoming data objects:
        Username: ${userstate}

        Channel: ${channel}

        Message: ${message}
        `);
  });

// processes !today command
const todayCommand = (region, argument, receivedMessage, channel) => {
  argument = encodeURIComponent(argument);
  console.log(`
    
    
    ${argument}
    
    
    `);
  //https://fresh-under-one-sky-email-api.herokuapp.com/
  if (argument.length > 0) {
    client.say(
      channel,
      "...I have received your request and am processing it..."
    );
    fetch(
      `http://fresh-under-one-sky-email-api.herokuapp.com/api/v1/today/?summoner_name=${argument}&region=${region}`,
      {
        method: "POST",
      }
    )
      .then((r) => r.text())
      // .then(r=> console.log(r))
      .then((response) => {
        response.replace(`"`, ``).replace("[", "").replace("]", "");
        console.log(response);
        argument = decodeURIComponent(argument);
        todayResponseHandler(response, receivedMessage, argument, channel);
      })
      .catch((error) => {
        console.log("This is the error you received: " + error);
        client.say(
          channel,
          "I've received your command but the server returned an error."
        );
      });
  } else {
    client.say(
      channel,
      `I've received the timer command, but your parameters made no sense. Syntax is: "!today <region> <summonername>`
    );
  }
};

const rankResponseHandler = (response) => {
  let parsedResponse = JSON.parse(response);
  const { summonerName, tier, rank, leaguePoints } = parsedResponse;
  let stringResponse = `Thompson is currently ${tier} ${rank} with ${leaguePoints} LP.`;
  console.log(stringResponse);
  return stringResponse;
};

const rankCommand = (message, channel) => {
  fetch(
    `http://fresh-under-one-sky-email-api.herokuapp.com/api/v1/rank_lol/?summoner_name=EveOnlyFans&region=na`,
    {
      method: "POST",
    }
  )
    .then((r) => r.text())
    // .then(r=> console.log(r))
    .then((response) => {
      response.replace(`"`, ``).replace("[", "").replace("]", "");

      let stringResponse = rankResponseHandler(response);
      client.say(channel, stringResponse);
      // argument = decodeURIComponent(argument);
      // todayResponseHandler(response, receivedMessage, argument, channel);
    })
    .catch((error) => {
      console.log("This is the error you received: " + error);
      client.say(
        channel,
        "I've received your command but the server returned an error."
      );
    });
};

const todayResponseHandler = (data, receivedMessage, argument, channel) => {
  let results = winCount(data);
  client.say(
    channel,
    `${argument}'s record today is ${results.won} - ${results.lost}, a ${results.percent}% win rate`
  );
  return;
};

const winCount = (data) => {
  data = data.split(",");
  const wonGames = data.filter(
    (game) =>
      game
        .replace(`"`, ``)
        .replace(`"`, ``)
        .replace("[", "")
        .replace("]", "") == `Win`
  ).length;
  const failGames = data.filter(
    (game) =>
      game
        .replace(`"`, ``)
        .replace(`"`, ``)
        .replace("[", "")
        .replace("]", "") == `Fail`
  ).length;
  const totalGames = data.length;

  let percentage = wonGames / totalGames;
  if (percentage) {
    percentage = Math.floor(percentage * 100);
  } else {
    percentage = 0;
  }

  console.log(percentage);
  const results = {
    won: wonGames,
    lost: failGames,
    total: totalGames,
    percent: percentage,
  };

  return results;
};

app.get("/subs", (req, res) => {
  res.send(JSON.stringify(objMessage));
  res.end();
});

app.listen(port, () =>
  console.log(`Subscriber monitor is listening on port ${port}!`)
);

// connects PubSub server to local socket.io server

// function to respond to !spendyourgold
const goldSpend = () => {
  socket.emit("gold");
};

const noTopEmit = () => {
  socket.emit("notop");
};

const pureSkillEmit = () => {
  socket.emit("pureskill");
};

const youNeedMeEmit = () => {
  socket.emit("youneedme");
};

const specialNeedsHandler = () => {
  socket.emit("specialneeds");
};

const potionEmit = () => {
  socket.emit("potion");
};

const lurkerEmit = () => {
  socket.emit("lurker");
};

const resetGold = () => {
  goldState = false;

  const resetGoldState = () => {
    goldState = true;
    return;
  };

  setTimeout(resetGoldState, 15000);
  return;
};

const gpRewardHandler = (userstate) => {
  console.log(userstate.username);
  const userData = { twitch_user: { username: userstate.username } };

  const fetchConfig = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(userData),
  };
  fetch(`${currentEnvironment}/twitch_user_add_gp`, fetchConfig)
    .then((r) => r.json())
    .then((r) => console.log(r));
};

const spendCheck = (userstate, channel, gpSpent) => {
  // no one can spend more than 5 gold
  if (gpSpent > 5) {
    client.action(
      "gamemasterthompson",
      "You cannot spend more than 5 gp on any given day."
    );
    return;
  }

  console.log(`
    ${gpSpent}gp sent to spend command!
    `);
  const userData = {
    twitch_user: {
      username: userstate.username,
      gp: gpSpent ? parseInt(gpSpent) : 1,
    },
  };

  const fetchConfig = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(userData),
  };
  //uses the same fetch as the !gpcheck, but the client return is different.
  // fetch("http://localhost:3001/twitch_user_gp_check", fetchConfig)
  fetch(`${currentEnvironment}/twitch_user_gp_check`, fetchConfig)
    .then((r) => r.json())
    .then((r) => {
      console.log("results of gp check:", r);

      if (r.gp > 0) {
        // how much they have chosen to spend
        gpSpent = gpSpent ? parseInt(gpSpent) : null;

        // error if we don't check for existence
        if (
          userExpenditures.item &&
          userExpenditures.item[userstate.username]
        ) {
          console.log(
            "How much has already been spent by user?: ",
            userExpenditures.item[userstate.username].spent
          );
          console.log("How much is going to be spent?: ", gpSpent);
          console.log(" ");

          // stop the whole thing if they'll pass 5
          if (userExpenditures.item[userstate.username].spent + gpSpent > 4) {
            client.action(
              "gamemasterthompson",
              `@${userstate.username}, you have already spent ${
                userExpenditures.item[userstate.username].spent
              }gp. You cannot spend more than 5gp on any given day.`
            );
            return;
          }

          // if they make it here, record their spending in the
          // userExpenditures object and send the information off to gpContestSpend
          // this works because we've already verified they won't go past 5 with the one above.
          if (userExpenditures.item[userstate.username].spent < 5) {
            console.log("This is userExpenditures!", userExpenditures);
            userExpenditures.item[userstate.username].spent += gpSpent || 1;
            gpContestSpend(userstate, channel, gpSpent);
          } else {
            client.say(
              channel,
              `@${userstate.username}, you have already spent your daily limit of gp!`
            );
            return;
          }
        } else {
          // if there is no userExpenditure property for the user, make one.
          let item = { [userstate.username]: { spent: gpSpent ? gpSpent : 1 } };
          userExpenditures = { ...userExpenditures, item };
          console.log("User Expensitures Array", userExpenditures);

          // if they get here, they can actually spend their gold.
          gpContestSpend(userstate, channel, gpSpent);
        }
      } else {
        client.say(
          channel,
          `@${userstate.username}, you do not currently have any gp to spend!`
        );
      }
    });
};

// !gpcheck command
const gpCheck = (userstate, channel) => {
  console.log(userstate.username);
  const userData = { twitch_user: { username: userstate.username } };

  const fetchConfig = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(userData),
  };
  // fetch("http://localhost:3001/twitch_user_gp_check", fetchConfig)
  fetch(`${currentEnvironment}/twitch_user_gp_check`, fetchConfig)
    .then((r) => r.json())
    .then((r) => {
      client.say(
        channel,
        `@${userstate.username}, you currently have ${r.gp ? r.gp : 0} gp.`
      );
    });
};

const adminGpCheck = (userstate, channel, firstArgument) => {
  console.log(userstate.username);
  const userData = { twitch_user: { username: firstArgument } };

  const fetchConfig = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(userData),
  };
  // fetch("http://localhost:3001/twitch_user_gp_check", fetchConfig)
  fetch(`${currentEnvironment}/twitch_user_gp_check`, fetchConfig)
    .then((r) => r.json())
    .then((r) => {
      client.say(
        channel,
        `@${firstArgument} currently has ${r.gp ? r.gp : 0} gp.`
      );
    });
};

const beginGiveAway = (userstate, channel) => {
  if (checkIfMe(userstate)) {
    client.action("gamemasterthompson", "Giveaway has started!");
    client.action(
      "gamemasterthompson",
      'For the next 60 seconds, you can type "1" in the chat to enter drawing for free RP!'
    );
    client.action(
      "gamemasterthompson",
      "Subscribers can type !spend <number> to use gp."
    );
    client.action(
      "gamemasterthompson",
      `Every gp spent counts as an additional entry for the giveaway. (Max 5 per day!)`
    );
    client.action(
      "gamemasterthompson",
      `If there are not ten separate participants, there will be no drawing! `
    );

    // changes state
    // enables !spend and "1"

    giveAwayActive = true;

    // timeout fires after 60 seconds, i.e. giveaway ends
    setTimeout((userstate, channel) => {
      // reset state,
      giveAwayActive = false;

      console.log(`Final giveaway array:
            
            
            ${giveAwayEntriesArray}
            
            
            `);

      client.action(
        "gamemasterthompson",
        `Entry time has ended. Drawing will now commence.`
      );
      // chooses winner from giveAwayEntriesArray
      contestDrawingHandler(channel, userstate);
    }, 60000);
  } else {
    client.action(
      "gamemasterthompson",
      `Sorry, you don't have the authorization to use this command!`
    );
  }
};

const contestDrawingHandler = (channel, userstate) => {
  // random item picker below
  let winner = random_item(giveAwayEntriesArray);

  // discern unique entries; JS sets cannot contain duplicates
  let contestantCountCheckerArray = new Set(giveAwayEntriesArray);

  console.log(
    "The following users entered the contest: ",
    contestantCountCheckerArray
  );
  console.log(
    "This many users entered the contest: ",
    contestantCountCheckerArray.size
  );

  // minimum number of contestants is 10
  if (contestantCountCheckerArray.size < 10) {
    if (contestantCountCheckerArray.size == 0) {
      client.action(
        "gamemasterthompson",
        `No one entered the drawing! Womp womp.`
      );
      contestantCountCheckerArray.forEach((e) => {
        const didSpendTrue =
          userExpenditures.item && userExpenditures.item[e] ? true : false;
        didSpendTrue ? addGold(e, userExpenditures.item[e].spent) : null;
      });
    } else {
      client.action(
        "gamemasterthompson",
        `Not enough people entered the drawing! Had there been, @${winner} would have won. Womp womp.`
      );
      contestantCountCheckerArray.forEach((e) => {
        const didSpendTrue =
          userExpenditures.item && userExpenditures.item[e] ? true : false;
        didSpendTrue ? addGold(e, userExpenditures.item[e].spent) : null;
      });
    }
  } else {
    client.action(
      "gamemasterthompson",
      `Congratulations, @${winner}! You have won the giveaway!`
    );
  }

  // reset the giveaway's tracking values:
  giveAwayEntriesArray = [];
  userExpenditures = {};
};

const gpContestSpend = (userstate, channel, gpSpent) => {
  console.log("User entered this much gold: ", gpSpent);
  const userData = {
    twitch_user: { username: userstate.username, gp: gpSpent },
  };

  const fetchConfig = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(userData),
  };
  // fetch("http://localhost:3001/twitch_user_contest_gp_spend", fetchConfig)
  fetch(`${currentEnvironment}/twitch_user_contest_gp_spend`, fetchConfig)
    .then((r) => r.json())
    .then((r) => {
      let user = userstate.username;
      giveAwayEntriesArray.push(user);
      console.log(
        "How much was spent?",
        parseInt(userExpenditures.item[userstate.username].spent) + "gp"
      );
      client.say(
        channel,
        `@${userstate.username} has thrown ${
          gpSpent && gpSpent > 1 ? gpSpent + " gold coins " : " a gold coin "
        }toward the drawing!`
      );
    });
};

const contestEntryHandler = (userstate) => {
  const user = userstate.username;
  let valid = giveAwayEntriesArray.filter((item) => item == user);
  if (valid.length == 0) {
    console.log("User not previously detected. User entered into drawing!");
    giveAwayEntriesArray.push(user);
  } else {
    console.log("User had already entered drawing and cannot do so again.");
    return;
  }
};

const addGold = (username, gold) => {
  console.log("Name of user to have gold returned:", username);
  console.log("Amount of gold to be returned: ", gold);
  const userData = { twitch_user: { gp: gold, username } };

  const fetchConfig = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(userData),
  };
  fetch(`${currentEnvironment}/twitch_user_add_gp_value`, fetchConfig)
    .then((r) => r.json())
    .then((r) => console.log(r));
};

function random_item(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function checkIfMe(userstate) {
  console.log(userstate.username);
  const value = userstate.username === "gamemasterthompson" ? true : false;
  console.log(value);
  return value;
}
