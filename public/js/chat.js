const socket = io();

const button = document.getElementById('abut');
const numberDisplay = document.getElementById('nd');

socket.on('update', (value) => {
    numberDisplay.innerHTML = value;
})

button.addEventListener('click',() => {
    socket.emit('click')
})
