/* globals Image, requestAnimationFrame */

const io = require('socket.io-client')
// const { Game } = require('./game.js')
const C = require('./constants.js')

// var game = new Game()
const socket = io()
var Board = new Array(C.BOARD_SIZE)
for (var k = 0; k < C.BOARD_SIZE; ++k) {
  Board[k] = new Array(C.BOARD_SIZE)
}

var board = document.getElementById('board')
board.width = window.innerWidth
board.height = window.innerHeight * 0.8
board.addEventListener('click', function (e) {
  console.log(e.pageX, e.pageY)
  console.log(e)
})
var turn = false
const ctx = board.getContext('2d')
const edge = board.height / 5

for (var i = 0; i < C.BOARD_SIZE; ++i) {
  for (var j = 0; j < C.BOARD_SIZE; ++j) {
    ctx.fillStyle = 'white'
    ctx.rect(j * edge, i * edge, edge, edge)
    ctx.fill()
    ctx.stroke()
  }
}
/*function loop (image, i , j) {
  requestAnimationFrame(loop)
  ctx.drawImage(image, edge, edge, edge, edge)
}
loop()*/
const buttons = document.getElementById('buttons')
buttons.width = window.innerWidth
buttons.height = window.innerHeight / 5

function createResourceButton (resourceType) {
  name.src = path
  buttons.appendChild(name)
  name.style.display = 'inline'
  name.style.float = 'left'
  name.style.width = (window.innerWidth * 0.19) + 'px'
  name.style.height = (window.innerHeight * 0.2) + 'px'
  name.style.border = '1px solid #000000'
}

var treeButton = document.createElement('img')
propertiesInitialButtons(treeButton, 'images/tree.jpeg')

treeButton.onclick = function () {
  if (turn) {
    socket.emit('answerConstruct', i, j, C.TREE)
    buttons.removeChild(treeButton)
    turn = false
  }
}

var meatButton = document.createElement('img')
propertiesInitialButtons(meatButton, 'images/meat.jpg')

meatButton.onclick = function () {
  if (turn) {
    socket.emit('answerConstruct', i, j, C.MEAT)
    buttons.removeChild(meatButton)
    turn = false
  }
}

var rockButton = document.createElement('img')
propertiesInitialButtons(rockButton, 'images/rock.jpg')

rockButton.onclick = function () {
  if (turn) {
    socket.emit('answerConstruct', i, j, C.ROCK)
    buttons.removeChild(rockButton)
    turn = false
  }
}

var sandButton = document.createElement('img')
propertiesInitialButtons(sandButton, 'images/sand.jpg')

sandButton.onclick = function () {
  if (turn) {
    socket.emit('answerConstruct', i, j, C.SAND)
    buttons.removeChild(sandButton)
    turn = false
  }
}

var waterButton = document.createElement('img')
propertiesInitialButtons(waterButton, 'images/water.jpeg')

waterButton.onclick = function () {
  if (turn) {
    socket.emit('answerConstruct', i, j, C.WATER)
    buttons.removeChild(waterButton)
    turn = false
  }
}
socket.on('changeFigure', (_i, _j) => {
  i = _i
  j = _j
  turn = true
})
