const express = require("express");
const app = express();
let server = app.listen(3005);
const axios = require("axios");
const cors = require("cors");
const io = require("socket.io-client");
const socket = io("http://localhost:3000");

/* status codes
400 - unknown game state, unchecked
401 - state has been checked, and the game hasn't started
200 - state has been checked, and the game has started
*/

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const remote_host = "https://127.0.0.1:2999";

const mySummonerName = "FinalBossEvelynn";

const url = {
  playerListURL: `${remote_host}/liveclientdata/playerlist`,
  eventConfigURL: `${remote_host}/liveclientdata/eventdata`,
  playerAbilitiesURL: `${remote_host}/liveclientdata/activeplayerabilities`,
  playerItemsURL: `${remote_host}/liveclientdata/playeritems?riotId=FinalBossEvelynn#NA1`,
  activePlayerURL: `${remote_host}/liveclientdata/activeplayer`,
  allGameDataURL: `${remote_host}/liveclientdata/allgamedata`,
  gameStatsURL: `${remote_host}/liveclientdata/gamestats`,
};

const goldThreshold = 1250;

const state = {
  gameStarted: false,
  status: 400,
  gameEnded: false,
  hitSix: false,
  gotRabadons: false,
  gotHextech: false,
  gotLichbane: false,
  gotZhonyas: false,
  gotVoidStaff: false,
  overMoneyTime: 0,
  overRabadonsTime: 0,
  overLichBaneTime: 0,
  overZhonyasTime: 0,
  overVoidStaffTime: 0,
  currentLevel: 1,
  futuresMarket: true,
  debtLimit: 0,
  itemDistance: {
    rabadons: 3600,
    hextech: 3200,
  },
  characters: { heroes: {}, villains: {} },
  heroTeam: "",
};

const price = {
  lichbane: 3100,
  rabadons: 3600,
  void: 3000,
  hextech: 2600,
  zhonyas: 2000,
  armguard: 1600,
  banshees: 1850,
  storm: 2900,
  verdant: 1600,
  jewel: 1100,
  wand: 850,
  rod: 1250,
  sheen: 900,
  wisp: 850,
  alt: 1100,
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.use(express.static(__dirname));

setInterval(async () => {
  let eventResponse;
  try {
    eventResponse = await hitLocalAPI(url.eventConfigURL);
  } catch (e) {
    console.log(
      "Unable to contact League Live Game API or game has not started."
    );
  }

  if (eventResponse.Events === undefined && state.status === 401) {
    return;
  }

  if (eventResponse.Events === undefined) {
    console.log(
      "\nUnable to contact League Live Game API.\nGame/ Live Server are probably not running.\n"
    );
    state.gameStarted = false;
    state.status = 401;
    state.gameStarted = false;
    state.gameEnded = false;
    state.hitSix = false;
    state.gotRabadons = false;
    state.gotHextech = false;
    state.gotLichbane = false;
    state.gotZhonyas = false;
    state.gotVoidStaff = false
    state.overMoneyTime = 0;
    state.overRabadonsTime = 0;
    state.overLichBaneTime = 0;
    state.overZhonyasTime = 0;
    state.overVoidStaffTime = 0;
    state.currentLevel = 1;
    state.futuresMarket = false;
    state.debtLimit = 0;
    state.itemDistance = {
      rabadons: 3600,
      hextech: 3200,
    };
    state.characters.heroes = {};
    state.characters.villains = {};
    state.heroTeam = "";
    return;
  }

  // console.log(eventResponse);
  if (
    eventResponse.Events !== undefined &&
    eventResponse.Events.filter((event) => {
      event.EventName === "GameStart";
    }) &&
    state.status != 200
  ) {
    console.log("The game has started.");
    state.status = 200;
    state.gameStarted = true;
  }

  if (state.status == 200) {
    // console.clear();
    init();
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

async function init() {
  const {
    playerItemsURL,
    activePlayerURL,
    gameStatsURL,
    allGameDataURL,
    playerListURL,
  } = url;

  const itemResponse = await hitLocalAPI(playerItemsURL);
  const playerResponse = await hitLocalAPI(activePlayerURL);
  const gameStats = await hitLocalAPI(gameStatsURL);
  const allGameData = await hitLocalAPI(allGameDataURL);
  const playerList = await hitLocalAPI(playerListURL);

  // This section verifies that the current player is the specified user and is playing Evelynn.
  function playingEvelynn(data) {
    let eveCheck;
    if (data.allPlayers) {

      eveCheck = data.allPlayers.filter((playerData) => playerData.riotIdGameName == "FinalBossEvelynn");

      /**
       * Sample playerdata object:
       *  {
          championName: 'Miss Fortune',
          isBot: false,
          isDead: false,
          items: [ [Object], [Object], [Object], [Object], [Object] ],
          level: 15,
          position: 'TOP',
          rawChampionName: 'game_character_displayname_MissFortune',
          rawSkinName: 'game_character_skin_displayname_MissFortune_17',
          respawnTimer: 0,
          riotId: 'FrankthaTank1#NA1',
          riotIdGameName: 'FrankthaTank1',
          riotIdTagLine: 'NA1',
          runes: {
            keystone: [Object],
            primaryRuneTree: [Object],
            secondaryRuneTree: [Object]
          },
       * 
       * 
       */

      return eveCheck.length > 0 ? true : false;
    } else {
      return false;
    }
  }

  const doIt = playingEvelynn(allGameData);

  if (!doIt) return;
  //

  let currentPlayer;
  if (playerList != undefined) {
    currentPlayer = playerList.filter(
      (player) => player.riotIdGameName == mySummonerName
    );
  }
  if (!playerList) {
    return;
  }

  // console.log(allGameData);
  // shorthand for current player level
  let currentLevel = playerResponse.level;
  // constantly updates gold state to currentGold. Possibly extraneous

  let currentGold = Math.floor(playerResponse.currentGold);
  state.currentGold = currentGold;
  let gameTime = Math.floor(gameStats.gameTime);

  // identifies which team the player is on

  state.heroTeam = currentPlayer[0].team;

  // go through each of the players and...
  allGameData.allPlayers.forEach((player) => {
    const champ = player.championName;
    // if there's an entry for that player,
    if (!state.characters[champ]) {
      console.log(
        "Adding character for the first time, and setting their control wards to 0."
      );
      state.characters[champ] = {};
      state.characters[champ]["controlWards"] = 0;
    }

    // grab the values of existing control ward state for that character
    // vs. the in-game actual value
    let currentWardState = state.characters[champ]["controlWards"];
    let actualWards = 0;

    player.items.forEach((item) => {
      if (item.displayName == "Control Ward") {
        actualWards = item.count;
      }
    });

    // if it's an enemy and they have fewer wards now than they
    // did the last time we saw them...
    if (player.team != state.heroTeam) {
      if (actualWards < currentWardState) {
        console.log(
          `${reportTimeInMinutes(
            gameTime
          )}: ${champ} recently placed a control ward!`
        );
        // socket.emit('redWardPlaced')
        socket.emit(`champWardPlaced`, champ, response => {
          console.log("test")
          console.log(
            `${reportTimeInMinutes(gameTime)}: ${champ} placed a control ward!`
          )

        })
      }

      if (actualWards > 0 && currentWardState == 0) {
        console.log(
          `${reportTimeInMinutes(gameTime)}: ${champ} purchased a control ward!`
        );
        // socket.emit('redWardPurchased')
        socket.emit(`champWardPurchased`, champ, response => {
          console.log("test")
          console.log(
            `${reportTimeInMinutes(gameTime)}: ${champ} purchased a control ward!`
          )

        })
      }
    }

    state.characters[champ]["controlWards"] = actualWards;
    // console.log("The character's team is: ", player.team);
    // console.log("Our team is: ", state.heroTeam);
  });

  // console.log(state);
  reportTimeInMinutes(gameTime);

  // determine whether or not the player has futures market
  if (
    playerResponse &&
    playerResponse.fullRunes &&
    playerResponse.fullRunes.generalRunes
  ) {
    const fmValue = playerResponse.fullRunes.generalRunes.filter(rune => rune.id === 8321)
    // set future's market value to true or false
    state.futuresMarket = fmValue.length > 0 ? true : false;

    // future's market debt limit formula determined by the following:
    if (state.futuresMarket && gameTime > 120) {
      state.debtLimit = 145 + Math.floor(gameTime / 60) * 5;
    }

    let actualGold;



    // if future's market is active:
    if (state.futuresMarket) {
      actualGold = currentGold + state.debtLimit;
    } else {
      actualGold = currentGold;
    }

    const hasRabadonsComponents = (items) => {
      if (state.gotRabadons == true) {
        // sets rod count to 0 and presence of rabadons to false
        return false
      }

      let count = 0;

      items.forEach((item) => {
        const itemID = item.itemID
        if (itemID == 1058) {
          count = count + 1
        }


      })

      if (count == 1 && actualGold >= 2350) {
        return true
      }

      if (count == 2 && actualGold >= 1100) {
        return true
      }
      return false
    }

    const getRabadons = hasRabadonsComponents(itemResponse)

    const hasLichBaneComponents = (items) => {
      if (state.gotLichBane == true) {
        // sets rod count to 0 and presence of rabadons to false
        return false
      }
      let sheen = false
      let wisp = false
      let alt = false


      itemResponse.forEach(item => {
        itemID = item.itemID
        if (itemID == 3057) {
          sheen = true
        }
        if (itemID == 3113) {
          wisp = true
        }
        if (itemID == 3145) {
          alt = true
        }



      })

      if (sheen && alt && actualGold >= (price.lichbane - price.wisp)) {

        return true;
      }

      if (sheen && wisp && actualGold >= (price.lichbane - price.alt)) {

        return true;
      }

      if (wisp && alt && (actualGold >= (price.lichbane - price.sheen))) {

        return true;
      }

      if (sheen && (actualGold >= (price.lichbane - price.wisp - price.alt))) {

        return true
      }

      if (alt && (actualGold >= (price.lichbane - price.wisp - price.sheen))) {

        return true
      }

      if (wisp && (actualGold >= (price.lichbane - price.sheen - price.alt))) {

        return true
      }


      if (sheen && wisp && alt && actualGold >= 250) {
        return true
      }

      return false
    }

    const getLichBane = hasLichBaneComponents(itemResponse)


    const hasZhonyasComponents = (items) => {
      if (state.gotZhonyas == true) {
        // sets rod count to 0 and presence of rabadons to false
        return false
      }
      let rod = false
      let armguard = false
      // itemResponse.forEach(item => console.log(item))

      itemResponse.forEach(item => {
        itemID = item.itemID
        if (itemID == 1058) {
          rod = true
        }
        if (itemID == 2420) {
          armguard = true
        }


      })
      if (armguard && rod && actualGold >= 400) {
        return true
      }

      return false
    }

    const getZhonyas = hasZhonyasComponents(itemResponse)

    const hasVoidStaffComponents = (items) => {
      if (state.gotVoidStaff == true) {
        // sets rod count to 0 and presence of rabadons to false
        return false
      }
      let jewel = false
      let wand = false
      // itemResponse.forEach(item => console.log(item))

      itemResponse.forEach(item => {
        itemID = item.itemID
        if (itemID == 1026) {
          wand = true
        }
        if (itemID == 4630) {
          jewel = true
        }


      })
      if (jewel && wand && actualGold >= 1050) {
        return true
      }

      return false
    }

    const getVoidStaff = hasVoidStaffComponents(itemResponse)

    // past the gold threshold for the first time, play the sound
    if (actualGold > goldThreshold && state.overMoneyTime == 0 && currentPlayer[0].items.length < 6) {
      console.log("Sent a gold notification!");
      state.overMoneyTime = gameTime;
      socket.emit("gold");
    }
    // if past the threshold and it's been 30 seconds.
    if (actualGold > goldThreshold && gameTime - state.overMoneyTime > 30 && currentPlayer[0].items.length < 6) {
      socket.emit("gold");
      state.overMoneyTime = gameTime;
    }

    if (getRabadons && state.overRabadonsTime == 0) {
      state.overRabadonsTime = gameTime
      socket.emit("getRabadons")
      console.log("You can afford your Rabadon's")
    }

    if (getRabadons && gameTime - state.overRabadonsTime > 30) {
      console.log("You can afford your Rabadon's")
      socket.emit("getRabadons")
      state.overRabadonsTime = gameTime
    }

    if (getLichBane && state.overLichBaneTime == 0) {
      state.overLichBaneTime = gameTime
      socket.emit("getLichBane")
      console.log("You can afford your Lich Bane")
    }

    if (getLichBane && gameTime - state.overLichBaneTime > 30) {
      console.log("You can afford your Lich Bane")
      socket.emit("getLichBane")
      state.overLichBaneTime = gameTime
    }

    if (getZhonyas && state.overZhonyasTime == 0) {
      state.overZhonyasTime = gameTime
      socket.emit("getZhonyas")
      console.log("You can afford your Zhonyas")
    }

    if (getZhonyas && gameTime - state.overZhonyasTime > 30) {
      console.log("You can afford your Zhonyas")
      socket.emit("getZhonyas")
      state.overZhonyasTime = gameTime
    }

    if (getVoidStaff && state.overVoidStaffTime == 0) {
      state.overVoidStaffTime = gameTime
      socket.emit("getVoidStaff")
      console.log("You can afford your Void Staff")
    }

    if (getVoidStaff && gameTime - state.overVoidStaffTime > 30) {
      socket.emit("getVoidStaff")
      console.log("You can afford your Void Staff")
      state.overVoidStaffTime = gameTime
    }




    // if UNDER the threshold, and but we've gone back...
    if (actualGold < 1250 && state.overMoneyTime > 0) {
      state.overMoneyTime = 0;
    }

    const eventResponse = await hitLocalAPI(url.eventConfigURL);
    eventResponse.Events.forEach((event) => {
      if (state.gameEnded == false && event.EventName == "GameEnd") {
        state.gameEnded = true;
        state.status = 400;
        console.log("The game has ended.");
      }

      if (state.gameStarted == false && event.EventName == "GameStart") {
        state.gameStarted = true;
        console.log("The game has started.");
      }
    });

    // needlessly large itemID == 1058
    // rabadon's itemID = 3089
    // hextech itemID = 3152
    // Amplifying Tome = 1052
    // hextech alternator = 3145
    // blasting wand = 1026




    itemResponse.forEach((item) => {
      // lich bane = 3100
      // void staff = 3135
      // zhonya's 3157
      // 
      // console.log("Item being parsed: ", item);
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

      if (
        !state.gotZhonyas &&
        item.itemID == 3157 &&
        state.gameEnded == false
      ) {
        console.log("You got your zhonyas!");
        socket.emit("zhonyas");
        state.gotZhonyas = true;
      }

      if (
        !state.gotLichbane &&
        item.itemID == 3100 &&
        state.gameEnded == false
      ) {
        console.log("You got your lich bane!");
        socket.emit("lichbane");
        state.gotLichbane = true;
      }

      if (
        !state.gotVoidStaff &&
        item.itemID == 3135 &&
        state.gameEnded == false
      ) {
        console.log("You got your void staff!");
        socket.emit("voidstaff");
        state.gotVoidStaff = true;
      }

    });

    if (currentLevel == 6 && !state.hitSix && state.gameEnded == false) {
      console.log("You hit 6!");
      socket.emit("villain");
      state.hitSix = true;
    }
  }
}

function reportTimeInMinutes(value) {
  if (value < 59) {
    return `${value}s`;
  } else {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    return `${minutes}m${seconds}s`;
  }
  console.log(value.toString().length);
  return;
}