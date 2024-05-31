const express = require("express");
const app = express();
let server = app.listen(3000);
const axios = require("axios");
const cors = require("cors");
const fs = require('node:fs')
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const dotenv = require("dotenv")

// key should be removed before anything is committed - Key is to ElevenLabs API
const key = "aef7b19409dcbafe0fa9c82f983053e4"
const domain = "https://api.elevenlabs.io"
const voicesPath = `/v1/voices/`
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

// grabs voice id from elevenlabs api
// using known name of voice
getVoice = async (voiceName) => {
  const url = `${domain}${voicesPath}`
  let voice_id
  try {


    response = await axios.get(url, {
      headers: {
        "accept": "application/json",
        "xi-api-key": key,
      },
    })
    voice = response.data.voices.filter(voice => voice.name === voiceName)
    // returns voice_id to use for whatever application needs
    return voice[0].voice_id
  } catch (error) {
    console.log("Error :", error)

  }
}

// response includes .mp3 file of text to speech
// string is whatever needs to be placed into text to speech
// voiceName is the name of the voice to use
// model_id is currently hard-coded
// other models can do other languages
const getText2Speech = async (string, voiceName, actionType, champ) => {

  // grab voice id from function above to inject into url
  const voice_id = await getVoice(voiceName)
  const url = `${domain}/v1/text-to-speech/${voice_id}?optimize_streaming_latency=0`
  try {


    const response = await axios({
      url: url,
      method: "post",
      data:
      {
        text: string,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0,
          similarity_boost: 0,
          style: 0.5,
          use_speaker_boost: true
        }
      }, responseType: 'arraybuffer',
      headers: {
        "accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": key,
      }
    })

    // write the file to the public folder, "binary" is necessary in third argument or blank file is created.
    fs.writeFileSync(`./public/${champ}_ward_${actionType}.mp3`, response.data, "binary")

  } catch (error) {
    console.log("Error :", error)
    console.log("Url: ", url)


  }
  return voice_id
}

const findVoiceFilePlaced = async (champ) => {
  // find out if the file exists for a ward placement
  fs.readFile(`./public/${champ}_ward_placed.mp3`, 'utf8', async (err, data) => {
    if (err) {
      console.error(err)
      console.log(`No file found for ${champ}'s ward placement.`)
      return false
    }
    else {
      console.log('File read successfully')
      return true
    }
  })
}

const findVoiceFilePurchased = async (champ) => {

  // find out if the file exists for a ward purchase
  fs.readFile(`./public/${champ}_ward_purchased.mp3`, 'utf8', async (err, data) => {
    if (err) {
      console.error(err)
      console.log(`No file found for ${champ}'s ward purchase.`)
      return false
    }
    else {
      console.log('File read successfully')
      return true
    }
  })

  // return some boolean
}

const writeVoiceFilePurchased = async (champ) => {
  const audio_file = await getText2Speech(`${champ} purchased a control ward.`, "Evelynn_v1", "purchased", champ);
}

const writeVoiceFilePlaced = async (champ) => {
  const audio_file = await getText2Speech(`${champ} placed a control ward.`, "Evelynn_v1", "placed", champ);
}

// runs on relevant socket emission. If the file exists, it plays the file. If it doesn't exist, it writes the file.
const handleChampWardPlaced = async (champ) => {
  const exists = findVoiceFilePlaced(champ);
  const response = await exists ? null : writeVoiceFilePlaced(champ);
}

// runs on relevant socket emission. If the file exists, it plays the file. If it doesn't exist, it writes the file.
const handleChampWardPurchased = async (champ) => {
  const exists = findVoiceFilePurchased(champ);
  const response = await exists ? null : writeVoiceFilePurchased(champ);
}


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
    // io.emit("rabadon");
  });

  socket.on("hextech", () => {
    console.log("Command 'hextech' got to the server.");
    io.emit("hextech");
  });

  socket.on("villain", () => {
    console.log("Command 'villain' got to the server.");
    // io.emit("villain");
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

  socket.on("champWardPurchased", async (champ) => {
    console.log("command 'champWardPurchased' got to the server.", "Champ: ", champ);
    handleChampWardPurchased(champ);
    io.emit("champWardPurchased", champ);
  });

  socket.on("champWardPlaced", async (champ) => {
    console.log("command 'champWardPlaced' got to the server.", "Champ: ", champ)
    handleChampWardPlaced(champ);
    io.emit("champWardPlaced", champ);
  });

  socket.on("getRabadons", async (socket) => {
    // io.emit("getRabadons");
  });

  socket.on("getLichBane", async (socket) => {
    console.log("Lich Bane alert sent!")
    io.emit("getLichBane");
  });
  socket.on("getZhonyas", async (socket) => {
    io.emit("getZhonyas");
  });
  socket.on("getVoidStaff", async (socket) => {
    io.emit("getVoidStaff");
  });






  socket.on('redWardPurchased', () => { io.emit('redWardPurchased') });
  socket.on('redWardPlaced', () => { io.emit('redWardPlaced') })
});
