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

export function addChat(userId, message) {
    if (chatBox) {
        socket.emit('message', userId, message)
    } else {
        chatBox = document.getElementById('chat-box')
        socket.emit('message', userId, message)
    }
}

export function scrollToBottom() {
    let scrollableDiv = document.querySelector('.chat-main-box');
    scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
}

export default {
    start,
    addChat,
    scrollToBottom,
}
