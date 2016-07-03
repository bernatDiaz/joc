const io = require('socket.io-client')
const { Game } = require('./game.js')
const C = require('./constants.js')

var game = new Game()
const socket = io()
var Board = new Array(C.BOARD_SIZE)
for(var k = 0; k < C.BOARD_SIZE; ++k){
  Board[k] = new Array(C.BOARD_SIZE)
}

var tauler = document.getElementById('board')
for (var i = 0; i < C.BOARD_SIZE; ++i) {
  for (var j = 0; j < C.BOARD_SIZE; ++j){
    var id = i.toString() + j.toString()
    Board[i][j] = $('<div class = casilla></div>')
    tauler.appendChild(Board[i][j])
  }
}

socket.on('changeColor', (i, j) =>{
  
})
