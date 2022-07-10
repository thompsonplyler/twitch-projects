const express = require("express");
const app = express();
let server = app.listen(3000);
const axios = require("axios");
const cors = require("cors");
// const { Server } = require("socket.io");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
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
