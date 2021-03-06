const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const im = require('./utils/message')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)


io.on('connection', (socket) => {
    socket.on('sendMessage', (message) => {
        const user = getUser(socket.id)
        console.log(user);
        io.to(user.room).emit('update', im.generate(user.username, message))
    })

    socket.on('joinRoom', ({username, room}, callback) => {
        const {error, user} = addUser({id: socket.id, username, room})
        if(error) {
           return callback(error)
        }

        socket.join(user.room)

        socket.emit('update', im.generate('Admin', `Welcome to the ${user.room} chatroom!`))
        socket.broadcast.to(user.room).emit('update',im.generate('Admin',`${user.username} has joined.`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })    

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('update', im.generate('Admin',`${user.username} has left.`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })

    //the callback is used for acknowledgements
    socket.on('sendLocation', (position, callback) => {
        const user  = getUser(socket.id)
        if(user){
            const mapLink = `https://google.com/maps?q=${position.lat},${position.long}`
            io.to(user.room).emit('showLocation', im.generate(user.username,mapLink))
            callback()
        }
        callback()
    })
})

app.use(express.static('public'))


module.exports = server;