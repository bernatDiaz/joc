const C = require('./constants.js')
class game{
  constructor (size = C.BOARD_SIZE){
    this.board = Array(C.BOARD_SIZE).fill().map(() => Array(C.BOARD_SIZE)).fill(C.EMPTY))
    this.players = {}
    this.sockets = []
    this.started = false
    this.n_players = 0
    this.next = false
  }
  onPlayerJoin(socket){
    if(!started){
      var i = 0
      while(this.sockets[i]) ++i
      this.sockets[i] = socket
      this.players[socket.id] = i
      this.n_players++
      if(n_players >= C.NUMBER_PLAYERS){
        this.started = true
        constructBoard()
      }
    }
  }
  constructBoard(){
    for (var i = 0; i < C.BOARD_SIZE; ++i){
      for (var j = 0; j < C.BOARD_SIZE; ++j){
        var p = (i * C.BOARD_SIZE + j) % C.NUMBER_PLAYERS
        next = false
        sockets[p].emit('construct', i, j)
        while(!next)
      }
    }
  }
  answerConstruct(i, j, c){
    next = true
    this.board[i][j].color = c;
    this.sockets.forEach((socket) => {
      if (socket) socket.emit('state', board)
    })
  }
}
