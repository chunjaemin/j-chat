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


io.on("connection", (socket) => {
  let room 

  socket.on('enter_room', (roomName)=>{
    room = roomName
    socket.join(room);
    console.log('room:' + room)
  })

  socket.on('disconnecting', () => {
   socket.to(room).emit('out_room')
  })

  socket.on('message', (message) => {
    socket.to(room).emit('message', message)
  })
});

