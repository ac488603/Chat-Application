const socket = io();
const chat = document.getElementById('chatfeed')
const input = document.getElementById('input')
const form = document.getElementById('form')

//redners message to screen
socket.on('update', (message) => {
    console.log(message)
    if(message!== undefined){
        let li = document.createElement('li')
        li.innerHTML = message
        chat.appendChild(li)
    }
})

//waits for user to push submit
//when user hit submit the message is sent to all clients
form.addEventListener('submit',(e) => {
    e.preventDefault();
    socket.emit('sendMessage', input.value)
})
