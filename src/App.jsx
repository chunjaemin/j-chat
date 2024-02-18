import './App.css'
import {useState, useEffect, useMemo } from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom'
import wave from './js/wave.js'
import {start} from './js/chatClient.js'

import ChatRoom from './component/chatRoom.jsx'
import Chat from './component/chat.jsx'
import FaceChat from './component/faceChat.jsx'
import RtcRoom from './component/rtcRoom.jsx'

function App() {
  let socket = useMemo(()=>{
    return start();
  },[])

  useEffect(()=>{

  },[]);
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage></MainPage>}></Route>
        <Route path="*" element={<MainPage></MainPage>}></Route>
        <Route path="/chatroom" element={<ChatRoom socket={socket}></ChatRoom>}></Route>
        <Route path="/chat/:id" element={<Chat socket={socket}></Chat>}></Route>
        <Route path="/rtcroom" element={<RtcRoom socket={socket}></RtcRoom>}></Route>
        <Route path="/facechat/:id" element={<FaceChat socket={socket}></FaceChat>}></Route>
      </Routes>
    </>
  )
}

function MainPage() {
  useEffect(() => {
    wave.draw(5);
  });
  let navigate = useNavigate();
  return (
    <>
      <div className='main-container'>
        <div className='main-logo-container'><p className='logo-p' onClick={()=>{navigate('/')}}>J-Chat & Zoom</p></div>
        <canvas id="canvas" className='background-canvas' ></canvas>
        <div className='main-flex-container'>
          <div className='flex-card1' onClick={()=>{navigate('chatroom')}}>
            <p className='card-p'>일반채팅</p>
          </div>
          <div className='flex-card2'onClick={()=>{navigate('rtcroom')}}>
            <p className='card-p'>화상채팅</p>
          </div>
        </div>
      </div>
    </>
  )
}


export default App
