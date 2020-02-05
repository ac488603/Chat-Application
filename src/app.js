const express = require('express')
const socketio = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

io.on('connection', (socket) => {
    socket.emit('update')
    socket.on('sendMessage', (message) => {
        io.emit('update', message)
        console.log(message)
    })
} )

app.use(express.static('public'))


module.exports = server;