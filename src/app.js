const express = require('express')
const socketio = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

io.on('connection', (socket) => {
    socket.emit('update', 'Welcome to the Chat!')
    socket.broadcast.emit('update',  'A new user has joined!')
    socket.on('sendMessage', (message) => {
        io.emit('update', message)
    })
    socket.on('disconnect', () => {
        io.emit('update', 'A user has left.')
    })
    socket.on('sendLocation', (position, callback) => {
           const mapLink = `https://google.com/maps?q=${position.lat},${position.long}`
           callback()
        io.emit('update',mapLink )
    })
})



app.use(express.static('public'))


module.exports = server;