const socket = io();

//elements
const chat = document.getElementById('chatfeed')
const input = document.getElementById('input')
const form = document.getElementById('form')
const sendLoc = document.getElementById('send-location')

//templates
const locTemplate = document.getElementById('location-link-template').innerHTML
const messageTemplate = document.getElementById('message-template').innerHTML
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML
//options
//option ignoreQueryPrefix removes the question mark
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoscroll = () => {
    const $newMessage = chat.lastElementChild
    const messageStyles = getComputedStyle($newMessage)
    
    const $newMessageheight = $newMessage.offsetHeight + parseInt(messageStyles.marginBottom) // height of element
    const visibleheight =  $newMessage.offsetHeight
    
    //height of message container
    const containerHeight = chat.scrollHeight

    //how far have I scrolled?
    const scrollOffset = chat.scrollTop + visibleheight

    if(containerHeight - $newMessageheight <= scrollOffset){
        chat.scrollTop = chat.scrollHeight
    }

}
//renders message to screen
socket.on('update', (data) => {
    if (data.text !== undefined) {
        const html = Mustache.render(messageTemplate, {
            username : data.username,
            message: data.text,
            createdAt: moment(data.createdAt).format('h:mm a')
        })
        chat.insertAdjacentHTML('beforeend', html)
        autoscroll()
    }
})

socket.on('showLocation', (data) => {
    const html = Mustache.render(locTemplate, {
        username: data.username,
        url: data.text,
        createdAt: moment(data.createdAt).format('h:mm a')
    })
    chat.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

//waits for user to push submit
//when user hit submit the message is sent to all clients
form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (input.value !== '')
        socket.emit('sendMessage', input.value)

    input.value = ''
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
        alert(error)
    })
})

socket.emit('joinRoom', {
    username,
    room
},  error => {
    if( error ) {
        alert(error)
        location.href = "/" // redirect to home page
    }

})

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.getElementById('sidebar').innerHTML = html
})