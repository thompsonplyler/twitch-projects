const express = require('express');
const THREE = require('three');

const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path')

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

app.use(express.static(__dirname));

server.listen(3000, () => {
    console.log('listening on *:3000');
  });



