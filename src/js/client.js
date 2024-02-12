import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";

let socket
let chatBox

export function start() {
    socket = io();
    return socket
}

export function enter(roomName) {
    socket.emit('enter_room', roomName);
}

export function addChat(message) {
    if (chatBox) {
        socket.emit('message', message)
        console.log('메세지보냄')
    } else {
        chatBox = document.getElementById('chat-box')
        socket.emit('message', message)
        console.log('메세지보냄')
    }
}

export default {
    start,
    addChat,
}
