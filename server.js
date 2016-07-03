const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const{game} = require('./game.js')

var Game = new Game(9)

app.use(express.static('dist'))
app.get('/', function (req, res) {
  res.sendfile('../dist/index.html')
})

io.on('connection', function (socket) {
  Game.onPlayerJoin(socket)
}
