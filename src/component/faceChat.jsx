import { useEffect, useState, useMemo,  useRef} from 'react';
import { useParams, useNavigate } from 'react-router-dom'

export default function FaceChat (props) {
    let socket = useMemo(()=>{return props.socket},[])
    let { id } = useParams();
    let myStream = useRef('')
    let videoSelf = useRef('')
    let rtcObject = useRef({})
    let htmlObjectId = useRef({})
    let htmlCount = useRef(0)
    let [sound, setSound] = useState(true)
    let [monitor, setMonitor] = useState(true)
    
    let navigate = useNavigate();

    useEffect(()=>{ 
        async function start() {
            if (!myStream.current) {
                await getMedia();
            }

            socket.on('socket-id', async (id) => {
                socket.emit('socket-id', id)
            })

            socket.on('get-userId', async (id) => {
                if (!myStream.current) {
                    await getMedia();
                }
                //상대방의 id를 받았을 때 할 행동
                createConnection(id);
                await createOffer(id);
            })

            socket.on('offer', async (offer, id) => {
                if (!myStream.current) {
                    await getMedia();
                }
                //이 코드가 여러번 실행됨
                createConnection(id);
                rtcObject.current[id].setRemoteDescription(offer);
                const answer = await rtcObject.current[id].createAnswer();
                rtcObject.current[id].setLocalDescription(answer);
                socket.emit('answer', answer, id);
            })

            socket.on('answer', (answer, id) => {
                rtcObject.current[id].setRemoteDescription(answer);
            })

            socket.on('ice', (icecandidate, id) => {
                if (rtcObject.current[id]) {
                    rtcObject.current[id].addIceCandidate(icecandidate);
                }
            })

            socket.on('leave-rtc', (id) => {
                const videoTag = document.getElementById(htmlObjectId.current[id]);
                videoTag.remove();
                rtcObject.current[id].close();
            })


            async function getMedia() {
                try {
                    myStream.current = await navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: true,
                    });
                    videoSelf.current.srcObject = myStream.current

                } catch (e) {
                    console.log(e);
                }
            }

            function createConnection(id) {
                htmlObjectId.current[id] = htmlCount.current;
                htmlCount.current += 1
                rtcObject.current[id] = new RTCPeerConnection({
                    iceServers: [
                        {
                            urls: "stun:stun.l.google.com:19302",
                            urls: "stun:stun1.l.google.com:19302",
                            urls: "stun:stun2.l.google.com:19302",
                            urls: "stun:stun3.l.google.com:19302",
                            urls: "stun:stun4.l.google.com:19302",
                        }
                    ]
                })

                rtcObject.current[id].addEventListener('icecandidate', (icecandidate) => {
                    socket.emit('ice', icecandidate.candidate, id)
                })

                rtcObject.current[id].ontrack = (e) => {
                    if (!document.getElementById(htmlObjectId.current[id])) {
                        var videoElement = document.createElement('video');
                        videoElement.id = htmlObjectId.current[id];
                        videoElement.className = 'video-self';
                        videoElement.autoplay = true;
                        videoElement.srcObject = e.streams[0];

                        var container = document.querySelector('.video-container')
                        container.appendChild(videoElement);
                    }
                    return false
                }
                myStream.current.getTracks().forEach(track => {
                    rtcObject.current[id].addTrack(track, myStream.current)
                });
            }


            async function createOffer(id) {
                const offer = await rtcObject.current[id].createOffer()
                rtcObject.current[id].setLocalDescription(offer);
                socket.emit('offer', offer, id, socket.id);
            }

            window.addEventListener("beforeunload", handleUnLoad);
            socket.emit('enter-rtc-room', 'WEBRTC' + id)
        }
        
        function handleUnLoad() {
            socket.emit('leave-rtc', 'WEBRTC' + id)
        }

        start();

        return () => {
            window.removeEventListener("beforeunload", handleUnLoad);
            socket.emit('leave-rtc', 'WEBRTC'+id)
        }
    },[])

    function setVideoSize(size) {
        const video = document.querySelectorAll('.video-self');

        video.forEach(element => {
            element.style.width = size + 'px';
        });
    }

    return(
        <>
            <div className='rtc-logo-container'><p onClick={()=>{navigate('/')}}>J-Zoom</p></div>
            <div className={sound ? 'sound-btn' : 'mute-btn'} onClick={()=>{
                setSound((sound)=>{return !sound})
                myStream.current.getAudioTracks().forEach((track)=>{track.enabled = !track.enabled})
            }}></div>
            <div className='red-btn' onClick={()=>{
                myStream.current.getVideoTracks().forEach((track)=>{track.enabled = !track.enabled})
            }}></div>
            <div className='rtc-flex-option-container'>
                <div className='rtc-option' onClick={()=>{setVideoSize(300)}}>X1</div>
                <div className='rtc-option' onClick={()=>{setVideoSize(450)}}>X1.5</div>
                <div className='rtc-option' onClick={()=>{setVideoSize(600)}}>X2</div>
                <div className='rtc-option' onClick={()=>{setVideoSize(750)}}>X2.5</div>
            </div>
            <div className='video-container'>
                <video autoPlay ref={videoSelf} className='video-self'></video>
            </div>
        </>
    )
} 