const express = require('express');

const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fetch = require('node-fetch');
const https = require('https')
const  path = require('path');
const fs = require('fs');

const reqUrl = 'https://127.0.0.1:2999/liveclientdata/activeplayer';

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname));


io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('gold',()=>{
      console.log("Command 'gold' got to the server.")
      io.emit('gold')
    })

    socket.on('villain',()=>{
      console.log("Command 'villain' got to the server.")
      io.emit('villain')
    })

    socket.on('notop',()=>{
      console.log("Command 'notop' got to the server.")
      io.emit('notop')
    })

    socket.on('pureskill',()=>{
      console.log("Command 'pureskill' got to the server.")
      io.emit('pureskill')
    })

    socket.on('youneedme',()=>{
      console.log("Command 'youneedme' got to the server.")
      io.emit('youneedme')
    })

    socket.on('potion',()=>{
      console.log("Command 'potion' got to the server.")
      io.emit('potion')
    })

    socket.on('lurker',()=>{
      console.log("Command 'lurker' got to the server.")
      io.emit('lurker')
    })

    socket.on('specialneeds',()=>{
      console.log("Command 'specialneeds' got to the server.")
      io.emit('specialneeds')
    })

  });

server.listen(3000, () => {
  console.log('listening on *:3000');
});




