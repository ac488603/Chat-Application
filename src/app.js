const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const im = require('./utils/message')

const app = express()
const server = http.createServer(app)
const io = socketio(server)


io.on('connection', (socket) => {
    socket.emit('update', im.generate('Welcome to the Chat!'))
    socket.broadcast.emit('update', im.generate('A new user has joined.'))
    socket.on('sendMessage', (message) => {
        io.emit('update', im.generate(message))
    })
    socket.on('disconnect', () => {
        io.emit('update', im.generate('A user has left.'))
    })
    //the callback is used for acknowledgements
    socket.on('sendLocation', (position, callback) => {
        const mapLink = `https://google.com/maps?q=${position.lat},${position.long}`
        callback()
        io.emit('showLocation', im.generate(mapLink))
    })
})



app.use(express.static('public'))


module.exports = server;