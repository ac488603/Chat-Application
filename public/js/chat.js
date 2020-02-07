const socket = io();
const chat = document.getElementById('chatfeed')
const input = document.getElementById('input')
const form = document.getElementById('form')
const sendLoc = document.getElementById('sl')
//redners message to screen
socket.on('update', (message) => {
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


document.querySelector('#send-location').addEventListener('click',()=>{
    if(!navigator.geolocation)
        return alert("Geolocation is not supported by your browser")
    navigator.geolocation.getCurrentPosition( position =>{
        socket.emit('sendLocation', {lat:position.coords.latitude, long:position.coords.longitude}, _ => {
            console.log('Location Received.')
        })
    }, error => {
        console.log(error)
    })
})


// sendLoc.addEventListener('click', () => {
//     if(!navigator.geolocation){
//         return alert('Geolocation is not supported by your browser.')
//     }

//     navigator.geolocation.getCurrentPosition( position => {
//         console.log(position)
//     }, error => {
//         console.log(error)
//     })
    
// })