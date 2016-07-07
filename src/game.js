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
    this.objects = []
  }

  constructBoard () {
    var _i = this.i
    var _j = this.j
    _j += this.nPlayers * 2
    if (_j >= C.BOARD_SIZE * 2 + 1) {
      _j = 1
      _i+= 2
    }
    var target = 0
    while ((this.i <= _i) && (this.j <= _j)) {
      this.sockets[target].emit('initialTurn', {i: this.i, j: this.j})
      this.j+= 2
      if (this.j >= C.BOARD_SIZE * 2 + 1) {
        this.j = 1
        this.i += 2
      }
      ++target
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
    this.objects = new Array(2 * this.nPlayers + 1)
    for(z = 0; z < 2 * this.nPlayers + 1; z++){
     this.objects[z] = new Array(C.BOARD_SIZE)
    }
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
