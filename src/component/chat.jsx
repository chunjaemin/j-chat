import '../App.css'
import { useEffect,useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import {addChat, scrollToBottom} from '../js/client.js'

export default function chatRoom(props) {

    let { id } = useParams();
    let [chat, changeChat] = useState([])
    let [message, changeMessage] = useState('')
    let [userId, setUserId] = useState(undefined)
    let [roomData, setRoomData] = useState([])
    let socket = useMemo(()=>{return props.socket},[])


    let navigate = useNavigate();

    useEffect(() => {
        socket.emit('enter_room', id)
        socket.on('message', (name, color, msg) => {
            let obj = {userName: name, userColor: color, message: msg}
            changeChat((chat) => [...chat, obj])
        })

        socket.on('initial_update',(id, data)=>{
            setUserId(id)
            setRoomData(()=>data)
        })

        socket.on('room_update',(data)=>{
            setRoomData(()=>data)
        })

        function handleUnLoad() {
            socket.emit('leave_room', id)
        }

        window.addEventListener("beforeunload", handleUnLoad);

        return () => {
            window.removeEventListener("beforeunload", handleUnLoad);
            socket.emit('leave_room', id)
        }
    }, [])

    useEffect(()=>{
        scrollToBottom();
    },[chat])

    return (
        <>
            <div className='chat-main-container'>
                <div className='chat-container'>
                    <div className='chat-flex-container'>
                        <div id='chat-box' className='chat-flex-container-left'>
                            <div className='chat-logo-container'><p className='chat-logo-p' onClick={()=>{navigate('/')}}>J-Chat</p></div>
                            <div className='chat-main-box'>
                                {
                                    chat.map((obj) => {
                                        return (
                                            <div>
                                            {
                                                obj && obj.userName == roomData[userId].name 
                                                ? <div className='chat-box-me'>
                                                    <div className='chat-box-me-small'>
                                                        <p className='chat-box-me-name' style={{color: obj.userColor}}>나</p>
                                                        <p className='chat-box-me-p'>{obj.message}</p>
                                                    </div>
                                                  </div> 
                                                : <div className='chat-box-opponent'>
                                                    <div className='chat-box-opponent-small'>
                                                        <p className='chat-box-opponent-name' style={{color: obj.userColor}}>{obj.userName}</p>
                                                        <p className='chat-box-opponent-p'>{obj.message}</p>
                                                    </div>
                                                  </div> 
                                            }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className='chat-flex-container-right'>
                            <div className='chat-user-title'>참가자 리스트</div>
                            <div className='chat-user-container'>
                                {
                                    roomData.map((element) => {
                                        return element ? <li className='user-name-li'><span className='user-name-p' style={{color: element.color}}>{element.name}</span></li> : null;
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className='input-container'>
                        <input placeholder='메세지를 입력해주세요'
                            className='chat-input'
                            value={message}
                            onInput={(e) => { changeMessage(e.target.value) }}
                            onKeyDown={(e) => {
                                if (e.code === 'Enter') {
                                    if (e.nativeEvent.isComposing == false && message !='') {
                                        addChat(userId, message);
                                        let obj = {userName: roomData[userId].name,userColor: roomData[userId].color, message: message}
                                        changeChat((chat) => [...chat, obj])
                                        changeMessage('')
                                    }
                                }
                            }}>
                        </input>
                    </div>
                </div>
            </div>
        </>
    )
}

