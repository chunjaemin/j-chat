import { Server } from "socket.io";

import path from 'path';
import express from 'express';
import { createServer } from 'node:http';
const __dirname = path.resolve(); 

const app = express();
const server = createServer(app);

const io = new Server(server, {
  // options
});

app.use(express.static(path.join(__dirname, '/dist')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
})

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});

let userObject = {}
let userName = ['John', 'Adam', 'Parker', 'Eva', 'Sophia','Brooks', 'Emily', 'Alexander', 'Reed', 'Sullivan']
let colorArray = ['red','green','blue','skyblue','yellow','brown','gray','black','purple','pink',]


io.on("connection", (socket) => {
  let room 
  let userId 
  let public_room = []

  socket.on('show_room', ()=>{
    public_room = publicRoom();
    socket.emit('show_room', public_room)
  })

  socket.on('enter_room', (roomName)=>{
    room = roomName
    addUserStatus(room)
    socket.emit('initial_update', userId , userObject[roomName])
    socket.join(room);
    socket.to(room).emit('room_update', userObject[roomName])
    socket.to(room).emit('message', '서버 메세지', 'rgb(255, 165, 0)', userObject[room][userId].name+'님이 채팅방에 입장하셨습니다.')
    public_room = publicRoom();
    io.emit('show_room', public_room);
  })

  socket.on('leave_room', (roomName)=>{
    socket.to(room).emit('message', '서버 메세지', 'rgb(255, 165, 0)', userObject[room][userId].name+'님이 채팅방에서 나가셨습니다.')
    socket.leave(roomName)
    
    if (userObject[roomName]) {
      userObject[roomName][userId] = undefined
    }

    socket.to(room).emit('room_update', userObject[roomName])

    const copy = public_room;
    public_room = publicRoom();

    if (copy.length != public_room.length) {
      io.emit('show_room', public_room)
    }
  })

  socket.on('message', (id, message) => {
    socket.to(room).emit('message', userObject[room][id].name, userObject[room][id].color, message)
  })

  function addUserStatus(roomName) {
    if (!userObject.hasOwnProperty(roomName)) {
      userObject[roomName] = new Array(10);
    }
    userId = setUser(roomName);
    userObject[roomName][userId] = {
      name: userName[userId],
      color: colorArray[userId],
    }
  }
});

function publicRoom () {
  const public_room = [];
  io.sockets.adapter.rooms.forEach((value, key)=>{
    const setArray = [...value]
    if (setArray[0] != key) {
      public_room.push(key)
    }
  })
  return public_room
}

function setUser(roomName) {
  for (let i=0; i<10; i++) {
    if (!userObject[roomName][i]) {
      return i
    }
  }
}