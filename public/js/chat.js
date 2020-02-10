const socket = io();
const chat = document.getElementById('chatfeed')
const input = document.getElementById('input')
const form = document.getElementById('form')
const sendLoc = document.getElementById('send-location')

//renders message to screen
socket.on('update', (message) => {
    if (message !== undefined) {
        let li = document.createElement('li')
        li.innerHTML = message
        chat.appendChild(li)
    }
})

socket.on('showLocation', (link) => {
    let anchor = document.createElement('a')
    anchor.setAttribute('href', link)
    anchor.innerHTML = 'view location'
    chat.appendChild(anchor)
})

//waits for user to push submit
//when user hit submit the message is sent to all clients
form.addEventListener('submit', (e) => {
    e.preventDefault();

    if(input.value !== '')
        socket.emit('sendMessage', input.value)
})


document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation)
        return alert("Geolocation is not supported by your browser")
    sendLoc.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition(position => {
        socket.emit('sendLocation', {
            lat: position.coords.latitude,
            long: position.coords.longitude
        }, _ => {
            console.log('Location Received.') //acknowledgement 
            sendLoc.removeAttribute('disabled')
        })
    }, error => {
        console.log(error)
    })
})