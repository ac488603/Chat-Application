const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const im = require('./utils/message')

const app = express()
const server = http.createServer(app)
const io = socketio(server)


io.on('connection', (socket) => {
    socket.on('sendMessage', (message) => {
        io.emit('update', im.generate(message))
    })

    socket.on('joinRoom', ({username, room}) => {
        socket.join(room)
        socket.emit('update', im.generate('Welcome to the Chat!'))
        socket.broadcast.to(room).emit('update', im.generate(`${username} has joined.`))
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