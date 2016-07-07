/* globals Image, requestAnimationFrame */
/* eslint-disable new-cap */
const PIXI = require('pixi.js')
const io = require('socket.io-client')
// const { Game } = require('./game.js')
const C = require('./constants.js')

// var game = new Game()
const socket = io()
const imatges = [
  'images/tree.jpeg',
  'images/water.jpeg',
  'images/sand.jpg',
  'images/rock.jpg',
  'images/meat.jpg'
]
const textures = imatges.map(function (path) {
  //return new PIXI.Texture(new PIXI.BaseTexture(new Image(path)))
  return PIXI.Texture.fromImage(path)
})

const emptyCanvas = document.createElement('canvas')
const emptyCtx = emptyCanvas.getContext('2d')
emptyCanvas.width = 1
emptyCanvas.height = 1
emptyCtx.fillStyle = 'white'
emptyCtx.fillRect(0, 0, 1, 1)
textures.unshift(new PIXI.Texture(new PIXI.BaseTexture(emptyCanvas)))

var startButton, text, i, j, horitzontal, vertical, board, dibujo
var turn = false
var renderer = new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight * 0.8)
document.body.appendChild(renderer.view)

const stage = new PIXI.Container()
const buttons = document.getElementById('buttons')
buttons.width = window.innerWidth
buttons.height = window.innerHeight / 5

function construction (nPlayers) {
  /* board.addEventListener('click', function (e) {
    console.log(e.pageX, e.pageY)
    console.log(e)
  })*/
  board = global.board = new Array(nPlayers * 2 + 1)
  for (var z = 0; z < nPlayers * 2 + 1; ++z) {
    board[z] = new Array(C.BOARD_SIZE * 2 + 1)
  }
  dibujo = global.dibujo = new Array(nPlayers * 2 + 1)
  for (z = 0; z < nPlayers * 2 + 1; ++z) {
    dibujo[z] = new Array(C.BOARD_SIZE * 2 + 1)
  }
  turn = false
  var offset = 2
  vertical = renderer.height / (nPlayers * 2 + 1) - (nPlayers + 1) * offset
  horitzontal = renderer.width / (C.BOARD_SIZE * 2 + 1) - (nPlayers + 1) * offset
  console.log(vertical, horitzontal)
  for (var k = 0; k < nPlayers * 2 + 1; ++k) {
    for (var y = 0; y < C.BOARD_SIZE * 2 + 1; ++y) {
      const cellSprite = new PIXI.Sprite(textures[C.EMPTY])
      stage.addChild(cellSprite)
      cellSprite.scale.x = horitzontal
      cellSprite.scale.y = vertical
      cellSprite.position.x = y * (horitzontal + offset) + offset
      cellSprite.position.y = k * (vertical + offset) + offset
      dibujo[k][y] = cellSprite
    }
  }
  debugger
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
      socket.emit('answerConstruct', {i: i, j: j, dibuix: resourceType})
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
      console.log('game started client')
      socket.emit('startGame')
    }
  }
})
socket.on('initialTurn', (posicions) => {
  console.log('initialTurn')
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
  dibujo[data.i][data.j].setTexture(textures[data.dibuix])
  //loop(data.dibuix, data.i, data.j)
})

function loop () {
  requestAnimationFrame(loop)
  renderer.render(stage)
}
loop()
