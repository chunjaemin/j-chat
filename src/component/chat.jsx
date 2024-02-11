import '../App.css'
import { useEffect,useState, useMemo } from 'react';
import { useParams } from 'react-router-dom'
import {start, addChat} from '../js/client.js'

export default function chatRoom() {

    let {id} = useParams();
    let [chat, changeChat] = useState([])
    let [message, changeMessage] = useState('')

    useEffect(()=>{

        let socket = start(id);

        socket.on('message', (msg) => {
            changeChat((chat)=> [...chat, msg])
        })
    },[])

    return (
        <>
            <div className='main-container'>
                <div className='chat-flex-container'>
                    <div id='chat-box' className='chat-flex-container-left'>
                        {
                            chat.map((element)=>{
                                return <li>{element}</li>
                            })
                        }
                    </div>
                    <div className='chat-flex-container-right'>

                    </div>
                </div>

                <input placeholder='메세지를 입력해주세요'
                    value={message}
                    onInput={(e) => {changeMessage(e.target.value) }}
                    onKeyDown={(e) => {
                        if (e.code === 'Enter') {
                            if (e.nativeEvent.isComposing == false) {
                                addChat(message);
                                changeChat((chat)=> [...chat, message])
                                changeMessage('')
                            }
                        }
                    }}>
                </input>
            </div>
        </>
    )
}

