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
  var fila = document.createElement('div')
  tauler.appendChild(fila)
  fila.display = 'block'
  fila.width = '100%'
  fila.height = '20%'
  fila.float = 'left'
  for (var j = 0; j < C.BOARD_SIZE; ++j) {
    Board[i][j] = document.createElement('img')
    Board[i][j].src = '../images/tree.jpeg'
    tauler.appendChild(Board[i][j])
    Board[i][j].display = 'inline'
    Board[i][j].float = 'left'
    Board[i][j].width = '20%'
    Board[i][j].height = '100%'
    Board[i][j].border = '1px solid #000000'
  }
}
var turn = false
var buttons = document.getElementById('buttons')
var treeButton = document.createElement('img')
treeButton.src = '../images/tree.jpeg'
buttons.appendChild(treeButton)
treeButton.display = 'inline'
treeButton.float = 'left'
treeButton.width = '20%'
treeButton.height = '100%'
treeButton.border = '1px solid #000000'
treeButton.onclick = function () {
  if (turn) {
    socket.emit('answerConstruct', i, j, C.TREE)
    buttons.removeChild(treeButton)
    turn = false
  }
}
var meatButton = document.createElement('img')
meatButton.src = '../images/meat.jpg'
buttons.appendChild(meatButton)
meatButton.display = 'inline'
meatButton.float = 'left'
meatButton.width = '20%'
meatButton.height = '100%'
meatButton.border = '1px solid #000000'
meatButton.onclick = function () {
  if (turn) {
    socket.emit('answerConstruct', i, j, C.MEAT)
    buttons.removeChild(meatButton)
    turn = false
  }
}
socket.on('changeFigure', (_i, _j) => {
  i = _i
  j = _j
  turn = true
})
