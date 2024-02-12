import '../App.css'
import { useEffect, useMemo, useState } from 'react';
import {useNavigate} from 'react-router-dom'
import wave from '../js/wave.js'

export default function chatRoom(props) {
  let [visible, changeVisible] = useState(false)
  let [roomArray, changeRoomArray] = useState([])
  let socket = useMemo(()=>{return props.socket},[])

  let navigate = useNavigate();
  useEffect(() => {
    wave.draw(5);
    socket.emit('show_room')
    socket.on('show_room', (rooms)=>{
      changeRoomArray(rooms)
    })
  },[]);
  return (
    <>
      <div className='main-container'>
        <canvas id="canvas" className='background-canvas'></canvas>
        <div className='chatRoom-container'>
          <div className='chatRoom-left-container'>
            <div className='chatRoom-card' onClick={()=>{changeVisible(true)}}>
              <p className='chatRoom-p'>방만들기</p>
            </div>
          </div>
          <div className='chatRoom-right-container'>
            {
              roomArray.map((element)=>{
                return (
                  <div className='chatRooms' onClick={()=>{navigate('/chat/' + element)}}>
                    <p className='chatRooms-p'>방제목: {element}</p>
                  </div>
                )
              })
            }
          </div>
        </div>
        {
          visible ? <ChatModal changeVisible={changeVisible}></ChatModal> : null
        }
      </div>
    </>
  )
}

function ChatModal (props) {
  let [roomName, changeRoomName] = useState('')
  let navigater = useNavigate();
  return(
    <div className='chat-modal-background' onClick={()=>{props.changeVisible(false)}}>
      <div className='chat-modal-container' onClick={(e)=>{e.stopPropagation()}}>
        <p>방이름{':'+roomName}</p>
        <input placeholder='방이름' onInput={(e)=>{changeRoomName(e.target.value)}}></input>
        <p>설정</p>
        <p>아직은 아무것도 없죠?</p>
        <div className='socket-create-room' onClick={()=>{navigater('/chat/' + roomName)}}><p className='btn-p'>방만들기</p></div>
      </div>
    </div>
  )
}