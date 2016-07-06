const express = require('express')
const morgan = require('morgan')
const path = require('path')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const { Game } = require('./game.js')

const game = new Game(5)

app.use(morgan('tiny'))
app.use(express.static(path.join(__dirname, '../dist/')))
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../dist/', 'index.html'))
})

io.on('connection', function (socket) {
  console.log(`${socket.id} joined the server`)
  game.onPlayerJoin(socket)
  socket.on('start', function () {
    console.log("game started server")
    game.onGameStart()
  })
  socket.on('answerConstruct', function (data) {
    game.answerConstruct(data)
  })
})

const port = 3000
http.listen(port, () => console.log(`server started on port ${port}`))
