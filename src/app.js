const express = require('express')
const socketio = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

io.on('connection', () => console.log('New Socket Connected'))

app.use(express.static('public'))


module.exports = server;