/* globals Image, requestAnimationFrame */

const io = require('socket.io-client')
// const { Game } = require('./game.js')
const C = require('./constants.js')

// var game = new Game()
const socket = io()
const imatges = ['images/tree.jpeg', 'images/water.jpeg', 'images/sand.jpg', 'images/rock.jpg', 'images/meat.jpg']
var startButton, text, i, j
var turn = false
var horitzontal, vertical
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
  vertical = board.height / nPlayers
  horitzontal = board.width / C.BOARD_SIZE

  for (var k = 0; k < nPlayers; ++k) {
    for (var y = 0; y < C.BOARD_SIZE; ++y) {
      ctx.fillStyle = 'white'
      ctx.rect(y * horitzontal, k * vertical, horitzontal, vertical)
      ctx.fill()
      ctx.stroke()
    }
  }
  createResourceButton(C.TREE)
  createResourceButton(C.WATER)
  createResourceButton(C.SAND)
  createResourceButton(C.ROCK)
  createResourceButton(C.MEAT)
}

function createResourceButton (resourceType) {
  var initialButton = document.createElement('img')
  initialButton.src = imatges[resourceType - 1]
  buttons.appendChild(initialButton)
  initialButton.style.display = 'inline'
  initialButton.style.float = 'left'
  initialButton.style.width = (window.innerWidth * 0.19) + 'px'
  initialButton.style.height = (window.innerHeight * 0.2) + 'px'
  initialButton.style.border = '1px solid #000000'
  initialButton.onclick = function () {
    if (turn) {
      socket.emit('answerConstruct', {i : i, j : j, dibuix : resourceType})
      buttons.removeChild(initialButton)
      turn = false
    }
  }
}

socket.on('waitScreen', function (nPlayers) {
  console.log('got waitScreen event')
  if (!text) {
    text = document.createElement('p')
    buttons.appendChild(text)
  }
  text.innerHTML = nPlayers.toString() + ' players'
  if (!startButton) {
    startButton = document.createElement('button')
    buttons.appendChild(startButton)
    startButton.innerHTML = 'Start'
    startButton.onclick = function () {
      console.log("game started client")
      socket.emit('start')
    }
  }
})
socket.on('initialTurn', (posicions) => {
  i = posicions.i
  j = posicions.j
  turn = true
})

socket.on('gameStarted', (nPlayers) => {
  buttons.removeChild(startButton)
  buttons.removeChild(text)
  construction(nPlayers)
})

socket.on('changeFigure', (data) => {
  console.log("change figure")
  loop(data.dibuix, data.i, data.j)
})

function loop (dibuix, i , j) {
  requestAnimationFrame(loop)
  image = imatges[dibuix - 1]
  ctx.drawImage(image, j * horitzontal, i * vertical, horitzontal, vertical)
}
