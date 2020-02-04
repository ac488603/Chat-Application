const express = require('express')
const socketio = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

let count = 0;
io.on('connection', (socket) => {
    socket.on('click', () => {
        count = count + 1;
        io.emit('update', count);
    })
} )

app.use(express.static('public'))


module.exports = server;