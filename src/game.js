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
  onPlayerJoin (socket) {
    if (!this.started) {
      var i = 0
      while (this.sockets[i]) ++i
      this.sockets[i] = socket
      this.players[socket.id] = i
      this.nPlayers++
      if (this.nPlayers >= C.NUMBER_PLAYERS) {
        this.started = true
        this.constructBoard()
      }
    }
  }
  constructBoard () {
    for (var i = 0; i < C.BOARD_SIZE; ++i) {
      for (var j = 0; j < C.BOARD_SIZE; ++j) {
        var p = (i * C.BOARD_SIZE + j) % C.NUMBER_PLAYERS
        this.next = false
        this.sockets[p].emit('construct', i, j)
        while (!this.next) {}
      }
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
