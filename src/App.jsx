import './App.css'
import {useState, useEffect, useMemo } from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom'
import wave from './js/wave.js'
import {start, addChat} from './js/client.js'

import ChatRoom from './component/chatRoom.jsx'
import Chat from './component/chat.jsx'

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
        <div className='main-logo-container'><p className='logo-p' onClick={()=>{navigate('/')}}>J-Chat</p></div>
        <canvas id="canvas" className='background-canvas' ></canvas>
        <div className='main-flex-container'>
          <div className='flex-card1' onClick={()=>{navigate('chatRoom')}}>
            <p className='card-p'>일반채팅</p>
          </div>
          <div className='flex-card2'>
            <p className='card-p'>화상채팅</p>
          </div>
        </div>
      </div>
    </>
  )
}


export default App