const C = require('./constants.js')

class Game {
  constructor (size = C.BOARD_SIZE) {
    this.board = []
    this.players = {}
    this.sockets = []
    this.started = false
    this.nPlayers = 0
    this.i = 0
    this.j = 0
    this.received = 0
  }

  constructBoard () {
    var _i = this.i
    var _j = this.j
    _j += this.nPlayers
    _j--
    if (_j >= 5) {
      _j -= 5
      _i++
    }
    while ((this.i <= _i) && (this.j <= _j)) {
      console.log(this.i)
      console.log(this.j)
      var p = (this.i * C.BOARD_SIZE + this.j) % this.nPlayers
      this.sockets[p].emit('initialTurn', {i: this.i, j: this.j})
      ++this.j
      if (this.j >= 5) {
        this.j -= 5
        ++this.i
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
      this.sockets.forEach((socket) => {
        if (socket) socket.emit('waitScreen', this.nPlayers)
        console.log(socket.id)
      })
    }
  }

  onGameStart () {
    console.log('game started game')
    this.started = true
    this.sockets.forEach((socket) => {
      if (socket) socket.emit('gameStarted', this.nPlayers)
    })
    this.constructBoard()
  }

  answerConstruct (data) {
    this.received++
    this.board[data.i] = []
    this.board[data.i][data.j] = {}
    this.board[data.i][data.j].figure = data.dibuix
    this.sockets.forEach((socket) => {
      if (socket) {
        console.log('emit')
        socket.emit('changeFigure', data)
        console.log(socket.id)
      }
    })
    if (this.received === this.nPlayers) {
      this.received = 0
      this.constructBoard()
    }
  }
}
exports.Game = Game
