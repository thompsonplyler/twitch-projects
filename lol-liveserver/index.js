const express = require("express");
const app = express();
let server = app.listen(3005);
const axios = require("axios");
const cors = require("cors");
const io = require("socket.io-client");
const socket = io("http://localhost:3000");

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const state = {
  gameStarted: false,
  gameEnded: false,
  hitSix: false,
  gotRabadons: false,
  gotHextech: false,
};

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
