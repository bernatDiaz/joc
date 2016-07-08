const C = require('./constants.js')

class Game {
  constructor (size = C.BOARD_SIZE) {
    this.board = []
    this.players = {}
    this.sockets = []
    this.started = false
    this.nPlayers = 0
    this.i = 1
    this.j = 1
    this.received = 0
    this.stop = false
  }

  constructBoard () {
    console.log("construct board")
    var _i = this.i
    var _j = this.j
    _j += this.nPlayers * 2
    while (_j >= C.BOARD_SIZE * 2 + 1) {
      _j -= C.BOARD_SIZE * 2
      _i += 2
    }
    console.log('max assignment', _i, _j)
    var target = 0
    console.log('sockets length', this.sockets.length)
    while ((this.i < _i) || (this.i == _i && this.j < _j)) {
      const socket = this.sockets[target]
      if (socket != null) {
        socket.emit('initialTurn', {i: this.i, j: this.j})
        this.j+= 2
        if (this.j >= C.BOARD_SIZE * 2 + 1) {
          this.j = 1
          this.i += 2
        }
      }
      ++target
    }
    if((this.i >= this.nPlayers * 2) && (this.j >= this.BOARD_SIZE * 2)) this.stop = true
  }

  onPlayerJoin (socket) {
    if (!this.started) {
      var i = 0
      while (this.sockets[i]) ++i
      this.sockets[i] = socket
      this.players[socket.id] = i
      this.nPlayers++
      this.sockets.forEach((socket) => {
        if (socket) socket.emit('waitScreen', this.nPlayers)
      })
    }
  }

  onGameStart () {
    console.log('game started game')
    this.started = true
    this.sockets.forEach((socket) => {
      if (socket) socket.emit('gameStarted', this.nPlayers)
    })
    this.board = new Array(2 * this.nPlayers + 1)
    for(var z = 0; z < 2 * this.nPlayers + 1; z++){
     this.board[z] = new Array(2 * C.BOARD_SIZE + 1)
    }
    this.constructBoard()
  }

  answerConstruct (data) {
    this.received++
    this.board[data.i][data.j] = data.dibuix
    this.sockets.forEach((socket) => {
      if (socket) {
        socket.emit('changeFigure', data)
      }
    })
    if (this.received === this.nPlayers && !this.stop) {
      this.received = 0
      this.constructBoard()
    }
  }
}
exports.Game = Game
