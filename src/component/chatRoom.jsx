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
    wave.draw(12);
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
                  <div className='chatRooms' onClick={()=>{navigate('/chat/' + element.roomName)}}>
                    <p className='chatRooms-p'>방제목: {element.roomName}</p>
                    <p className='chatRooms-member'>{element.count}/10</p>
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
        <p className='roomName-title'>방이름{':'+roomName}</p>
        <input placeholder='방이름' onInput={(e)=>{changeRoomName(e.target.value)}} className='roomName-input'></input>
        <p className='roomName-option'>설정</p>
        <div className='roomName-options'><p>옵션 같은건 없어요~</p></div>
        <div className='socket-create-room' onClick={() => {
          if (roomName) {
            navigater('/chat/' + roomName)
          } else {
            alert('방이름을 입력해주세요')
          }
        }
        }><p className='btn-p'>방만들기</p></div>
      </div>
    </div>
  )
}