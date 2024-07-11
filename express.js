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
  let public_rtc_room = []

  //웹소켓 채팅코드
  socket.on('show_room', ()=>{
    public_room = publicRoom();
    socket.emit('show_room', public_room)
  })

  socket.on('enter_room', (roomName)=>{
    room = roomName
    addUserStatus(room)
    socket.emit('initial_update', userId , userObject[roomName])
    if (userId != -1) {
      socket.join(room);
      socket.to(room).emit('room_update', userObject[roomName])
      socket.to(room).emit('message', '서버 메세지', 'rgb(255, 165, 0)', userObject[room][userId].name+'님이 채팅방에 입장하셨습니다.')
      public_room = publicRoom();
      io.emit('show_room', public_room);
    }
  })

  socket.on('leave_room', (roomName) => {
    if (userId != -1) {
      socket.to(room).emit('message', '서버 메세지', 'rgb(255, 165, 0)', userObject[room][userId].name + '님이 채팅방에서 나가셨습니다.')
      socket.leave(roomName)

      if (userObject[roomName]) {
        userObject[roomName][userId] = undefined
      }

      socket.to(room).emit('room_update', userObject[roomName])

      public_room = publicRoom();
      io.emit('show_room', public_room)
    }
  })

  socket.on('message', (id, message) => {
    socket.to(room).emit('message', userObject[room][id].name, userObject[room][id].color, message)
  })

  function addUserStatus(roomName) {
    //처음 방을 만든 사람이라면, 방이 없기 때문에 방을 만들기
    if (!userObject.hasOwnProperty(roomName)) {
      //최대 10명까지 수용 가능한 방을 만듬 
      userObject[roomName] = new Array(10);
    }

    //유저 id 발급
    userId = setUserId(roomName);

    //유저 id에 맞는 이름과 색상을 방관리 변수에 넣어 둠 userId가 정상적으로 존재할 경우에
    if (userId != -1) {
      userObject[roomName][userId] = {
        name: userName[userId],
        color: colorArray[userId],
      }
    }
  }

  //생성 된 모든 방 연결 중, private를 제외시켜, public방들을 가져오는 함수. 참고로 private는 value[0]과 값이 같음 
  function publicRoom () {
    const public_room = [];
    io.sockets.adapter.rooms.forEach((value, key)=>{
      const setArray = [...value]
      //console.log("key:" + key + ", value:" + setArray) value와 key의 구조를 알고 싶다면 쓰세용
      if (setArray[0] != key && !key.includes("WEBRTC")) {
        const obj = {
          roomName : key,
          count : setArray.length
        }
        public_room.push(obj);
      }
    })
    return public_room
  }

  //유저의 id발급 하는 함수, 1~10중 1부터 탐색해서 안쓰고 있는 id를 찾아서 유저에게 줌
  function setUserId(roomName) {
    for (let i=0; i<10; i++) {
      if (!userObject[roomName][i]) {
        return i
      }
    }
    return -1; //발급 받을 수 있는 인덱스가 없을 경우 -1 리턴 
  }

  //web-RTC 연결 코드 
  socket.on('rtc_show_room', ()=>{
    public_rtc_room = publicRtcRoom();
    socket.emit('rtc_show_room', public_rtc_room)
  })

  socket.on('enter-rtc-room', (roomName)=>{
    room = roomName
    socket.join(room);
    socket.to(room).emit('socket-id', socket.id);
    public_rtc_room = publicRtcRoom()
    io.emit('rtc_show_room', public_rtc_room);
  })

  socket.on('leave-rtc', (roomName)=>{
    socket.to(roomName).emit('leave-rtc', socket.id)
    socket.leave(roomName)

    const prev = public_rtc_room;
    public_rtc_room = publicRtcRoom();

    if (prev.length != public_room.length) {
      io.emit('rtc_show_room', public_rtc_room)
    }
  })

  socket.on('socket-id', (opponent_id)=>{
    socket.to(opponent_id).emit('get-userId', socket.id);
  })

  socket.on('offer', (offer, opponent_id, my_id) => {
    socket.to(opponent_id).emit('offer', offer, my_id);
  })

  socket.on('answer', (answer, id) => {
    socket.to(id).emit('answer', answer, socket.id)
  })

  socket.on('ice', (icecandidate, id)=>{
    socket.to(id).emit('ice', icecandidate, socket.id)
  })
});


function publicRtcRoom () {
  const public_rtc_room = [];
  io.sockets.adapter.rooms.forEach((value, key)=>{
    const setArray = [...value]
    if (setArray[0] != key) {
      if (key.includes("WEBRTC")) {
        //WEBRTC이름을 제거하고 룸이름을 넣도록
        const roomName = key.replace("WEBRTC", "");
        public_rtc_room.push(roomName)
      }
    }
  })
  return public_rtc_room
}




