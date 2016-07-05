const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const C = require('./constants.js')
class game {
  constructor (size = C.BOARD_SIZE) {
    this.board = []
    this.players = {}
    this.sockets = []
    this.started = false
    this.nPlayers = 0
    this.next = false
  }
  constructBoard () {
    for (var i = 0; i < this.nPlayers; ++i) {
      for (var j = 0; j < C.BOARD_SIZE; ++j) {
        var p = (i * C.BOARD_SIZE + j) % C.NUMBER_PLAYERS
        this.next = false
        this.sockets[p].emit('initialTurn', i, j)
        while (!this.next) {}
      }
    }
  }
  onPlayerJoin (socket) {
    if (!this.started) {
      var i = 0
      while (this.sockets[i]) ++i
      this.sockets[i] = socket
      this.players[socket.id] = i
      this.nPlayers++
      io.sockets.emit('waitScreen', this.nPlayers)
      io.sockets.on('start', function () {
        this.started = true
        io.sockets.emit('gameStarted', this.nPlayers)
        this.constructBoard()
      })
    }
  }
  answerConstruct (i, j, f) {
    this.next = true
    this.board[i][j].figure = f
    this.sockets.forEach((socket) => {
      if (socket) socket.emit('changeFigure', i, j, f)
    })
  }
}
exports.game = game
