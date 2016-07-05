/* globals Image, requestAnimationFrame */

const io = require('socket.io-client')
// const { Game } = require('./game.js')
const C = require('./constants.js')

// var game = new Game()
const socket = io()
const imatges = ['images/tree.jpeg', 'images/water.jpeg', 'images/sand.jpg', 'images/rock.jpg', 'images/meat.jpg']
var startButton, text
var i, j
var turn = false
/* var Board = new Array(C.BOARD_SIZE)
for (var k = 0; k < C.BOARD_SIZE; ++k) {
  Board[k] = new Array(C.BOARD_SIZE)
}*/
const buttons = document.getElementById('buttons')
buttons.width = window.innerWidth
buttons.height = window.innerHeight / 5

function construction (nPlayers) {
  var board = document.getElementById('board')
  board.width = window.innerWidth
  board.height = window.innerHeight * 0.8
  /* board.addEventListener('click', function (e) {
    console.log(e.pageX, e.pageY)
    console.log(e)
  })*/
  var turn = false
  const ctx = board.getContext('2d')
  const vertical = board.height / nPlayers
  const horitzontal = board.width / C.BOARD_SIZE

  for (var k = 0; k < nPlayers; ++k) {
    for (var y = 0; y < C.BOARD_SIZE; ++y) {
      ctx.fillStyle = 'white'
      ctx.rect(y * horitzontal, k * vertical, horitzontal, vertical)
      ctx.fill()
      ctx.stroke()
    }
  }
  /* function loop (image, i , j) {
    requestAnimationFrame(loop)
    ctx.drawImage(image, edge, edge, edge, edge)
  }
  loop()*/
  createResourceButton(C.TREE - 1)
  createResourceButton(C.WATER - 1)
  createResourceButton(C.SAND - 1)
  createResourceButton(C.ROCK - 1)
  createResourceButton(C.MEAT - 1)
}

function createResourceButton (resourceType) {
  var initialButton = document.createElement('img')
  initialButton.src = imatges[resourceType]
  buttons.appendChild(initialButton)
  initialButton.style.display = 'inline'
  initialButton.style.float = 'left'
  initialButton.style.width = (window.innerWidth * 0.19) + 'px'
  initialButton.style.height = (window.innerHeight * 0.2) + 'px'
  initialButton.style.border = '1px solid #000000'
  initialButton.onclick = function () {
    if (turn) {
      socket.emit('answerConstruct', i, j, resourceType)
      buttons.removeChild(initialButton)
      turn = false
    }
  }
}

socket.on('waitScreen', function (nPlayers) {
  if (!text){
    text = document.createElement('div')
    buttons.appendChild(text)
  }
  text.value = nPlayers.toString() + ' players'
  if (!startButton) {
    startButton = document.createElement('button')
    buttons.appendChild(startButton)
    startButton.value = 'Start'
    startButton.onclick = function () {
      socket.emit('start')
    }
  }
})
socket.on('initialTurn', (_i, _j) => {
  i = _i
  j = _j
  turn = true
})
socket.on('gameStarted', (nPlayers) => {
  buttons.removeChild(startButton)
  construction(nPlayers)
})
