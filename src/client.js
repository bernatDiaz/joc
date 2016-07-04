const io = require('socket.io-client')
// const { Game } = require('./game.js')
const C = require('./constants.js')

// var game = new Game()
const socket = io()
var Board = new Array(C.BOARD_SIZE)
for (var k = 0; k < C.BOARD_SIZE; ++k) {
  Board[k] = new Array(C.BOARD_SIZE)
}

var tauler = document.getElementById('board')
for (var i = 0; i < C.BOARD_SIZE; ++i) {
  for (var j = 0; j < C.BOARD_SIZE; ++j) {
    Board[i][j] = document.createElement('div')
    Board[i][j].class = 'casilla'
    tauler.appendChild(Board[i][j])
  }
}
var turn = false
var buttons = document.getElementById('buttons')
var treeButton = document.createElement('div')
treeButton.class = 'initialButton'
buttons.appendChild(treeButton)
treeButton.onclick = function () {
  if (turn) {
    socket.emit('answerConstruct', i, j, C.TREE)
    buttons.removeChild(treeButton)
    turn = false
  }
}
socket.on('changeFigure', (_i, _j) => {
  i = _i
  j = _j
  turn = true
})
