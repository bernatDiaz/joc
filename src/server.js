const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const {Game} = require('./game.js')

var game = new Game(5)

app.use(express.static('dist'))
app.get('/', function (req, res) {
  res.sendfile('../dist/index.html')
})

io.on('connection', function (socket) {
  game.onPlayerJoin(socket)
})
