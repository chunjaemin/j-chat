import '../App.css'
import { useEffect,useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import {start, addChat} from '../js/client.js'

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
        socket.on('message', (msg) => {
            changeChat((chat) => [...chat, msg])
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

    return (
        <>
            <div className='chat-main-container'>
                <div className='chat-container'>
                    <div className='chat-flex-container'>
                        <div id='chat-box' className='chat-flex-container-left'>
                            <div className='chat-logo-container'><p className='chat-logo-p' onClick={()=>{navigate('/')}}>J-Chat</p></div>
                            {
                                chat.map((element) => {
                                    return <li>{element}</li>
                                })
                            }
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
                                    if (e.nativeEvent.isComposing == false) {
                                        addChat(message);
                                        changeChat((chat) => [...chat, message])
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

