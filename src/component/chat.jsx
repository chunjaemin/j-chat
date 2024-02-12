import '../App.css'
import { useEffect,useState, useMemo } from 'react';
import { useParams } from 'react-router-dom'
import {start, addChat} from '../js/client.js'

export default function chatRoom(props) {

    let { id } = useParams();
    let [chat, changeChat] = useState([])
    let [message, changeMessage] = useState('')
    let socket = useMemo(()=>{return props.socket},[])
    useEffect(() => {
        socket.emit('enter_room', id)
        socket.on('message', (msg) => {
            changeChat((chat) => [...chat, msg])
        })
        return () => {
            socket.emit('leave_room', id)
        }
    }, [])

    return (
        <>
            <div className='chat-main-container'>
                <div className='chat-container'>
                    <div className='chat-flex-container'>
                        <div id='chat-box' className='chat-flex-container-left'>
                            {
                                chat.map((element) => {
                                    return <li>{element}</li>
                                })
                            }
                        </div>
                        <div className='chat-flex-container-right'>

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

