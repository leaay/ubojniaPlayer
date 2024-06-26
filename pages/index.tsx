import type { NextPage } from 'next'
import Image from 'next/future/image'
import Head from 'next/head'
import io from "socket.io-client";
import dynamic from 'next/dynamic'
import { useEffect , useState , useRef} from 'react';
import Chat from '../components/Chat';
import styles from '../styles/page.module.scss'
import Nick from '../components/Nick';
import AddVideo from '../components/AddVideo'
const Player = dynamic(() => import("../components/Player"), {ssr: false});
import useTimeToMinSec from '../components/useTimeToMinSec';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io();

interface nick{
    nick:string,
    color:string
}
interface video{
    url:string,
    title:string,
    user:string
}

const Home: NextPage = () => {


  const [video , setVideo] = useState<video>({url:"",title:"",user:""});
  const [isPlaying , setIsPlaying] = useState<boolean>(true)
  const [isMuted , setIsMuted] = useState<boolean>(true)
  const [userNick , setUserNick] = useState<nick>({nick:'',color:'#000000'});

  const [newVideoModal , setNewVideoModal] = useState<boolean>(false)
  const [isOwner , setIsOwner] = useState<boolean>(false)
  const [videoProgress , setVideoProgress] = useState<number>(0)
  const [vidDuration , setVidDuration] = useState<number>(0)

  const [currentSec , setCurrentSec] = useState<number>(0)
  const [streamedSec , setStreamedSec] = useState<number>(0)

  const playerRef:any = useRef()

  const {min:currentMin , sec:currentSecond} = useTimeToMinSec(currentSec)
  const {min:durationMin , sec:durationSecond} = useTimeToMinSec(vidDuration)
  
  


  async function connectSocket() {
    await fetch("/api/socket");
  }


  function handlePause(){
    socket.emit("pause")
    setIsPlaying(false)
  }

  function handleResume(){
    socket.emit("resume")
    setIsPlaying(true)
  }

  function handleCancel(){
    setVideo({url:"",title:"",user:""})
    setCurrentSec(0)
    setVidDuration(0)
    setVideoProgress(0)
    setStreamedSec(0)
    toast('Video skiped')
    if(isOwner){
      socket.emit('newVid' , {url:'' , title:"" , user: ''})
    }
    
  }

  function handleStream(sec:number){
    if(isOwner){
    socket.emit('streamingVideo' , {sec:sec.toFixed(0) , streamedVideo:video})
    }
  }


  
  useEffect(() => {
      
    connectSocket();

    
    socket.on('receive', (msg:video) => {
      setVideo(msg)
      setIsOwner(false)
      setIsPlaying(true)

      if(msg.url === ''){
        toast('Video skiped')
      }else{
        toast(`Video added by ${msg.user}`)
      }
      
    })

    socket.on('stop', ()=>{
      setIsPlaying(false)
      toast('Video paused')
     
      
      
    })

    socket.on('res', ()=>{
      setIsPlaying(true)
      
    })

    socket.on('streamedVideo' ,(msg:{sec:number , streamedVideo:video})=>{

        console.log('streamedVideo' + msg.sec)

        if(isOwner){
          return
          
        }else{

          
          
          setStreamedSec(Number(msg.sec))
          
          if(video.url !== msg.streamedVideo.url){
            setVideo(msg.streamedVideo)
            playerRef.current?.seekTo(msg.sec)
          }
         

        }

    })





    return ()=>{
      socket.off('receive'),
      socket.off('stop'),
      socket.off('res'),
      socket.off('connect'),
      socket.off('newUser'),
      socket.off('streamedVideo')
  
    }
  }, []);

  useEffect(() => {

    if(isOwner){

      if(currentSec  >= vidDuration - 1){

        setTimeout(() => {
          setVideo({url:"",title:"",user:""})
          setCurrentSec(0)
          setVidDuration(0)
          setVideoProgress(0)
          setStreamedSec(0)
        }, 3000);

        
      }
  
    }else{

      if(streamedSec  >= vidDuration - 1 && video.url !== ""){

        setTimeout(() => {

          setVideo({url:"",title:"",user:""})
          setCurrentSec(0)
          setVidDuration(0)
          setVideoProgress(0)
          setStreamedSec(0)

        }, 3000);

        
      }

      if(streamedSec - 2 > currentSec || streamedSec + 2 < currentSec ){
        console.log('seekTo')
        playerRef.current?.seekTo(streamedSec)
      }

    }



  },[currentSec])




  return (
    <>
          <ToastContainer 
          position="bottom-left"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          draggable
          theme="dark"
          pauseOnFocusLoss
        />
    
    <div className={styles.pageBody} >


      <Head>
        <title>UBOJNIA</title>
        <meta name="description" content="UBOJNIA PLAYER" />
        <link rel="apple-touch-icon" sizes="180x180" href="favico/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="favico/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="favico/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
      </Head>


      
        <div className={styles.playerWrapper}>


            <Player
              setVideoProgress={setVideoProgress}
              playerRef={playerRef} 
              isPlaying={isPlaying} 
              isMuted={isMuted} 
              video={video} 
              handlePause={handlePause} 
              handleResume={handleResume} 
              setIsPlaying={setIsPlaying} 
              setVideo={setVideo}
              setVidDuration={setVidDuration}
              setCurrentSec={setCurrentSec}
              handleStream={handleStream}
              socket={socket}
            />

            

          <div style={ video.title === '' ? {opacity:'1'} : {}} className={styles.playerOverlay}>
            <div className={styles.playerOverlayWrapper}>
                {video.title === '' &&  <p    >no video playing right now</p>}

                {video.title !== '' && 
                  <>
                    <div>  
                        <h1 ><a rel="noreferrer" target="_blank" href={video.url}>{video.title} </a></h1>
                        <button className='button2' onClick={()=>setIsMuted(!isMuted)}>
                          <Image alt='mute or unmute' src={isMuted ? '/mute.svg' : '/unmute.svg'} width={40} height={40} /></button>
                        <h3>requested by: {video.user}</h3>
                    </div>
                    <div className={styles.playerOverlayProgress}>
                      {video.title=== '' ? null : <p> {currentMin}:{currentSecond < 10 ? '0' : null}{currentSecond} / {durationMin}:{durationSecond < 10 ? '0': null}{durationSecond} </p> }
                      
                      <div className={styles.playerOverlayProgressBarWrapper}>
                          <div style={{width:`${videoProgress * 100}%`}} className={styles.playerOverlayProgressBar}></div>
                          <div className={styles.playerOverlayGrayLine}></div>
                      </div>

                    </div>
                  </>
                }
            </div>
          </div>

            <div style={{width:`${videoProgress * 100}%`}}  className={styles.playerVideoDuration}> </div>

        </div>

          <div className={styles.playerLinks}>

            {userNick.nick !== '' && 

              <>
                {video.title === '' ? <button className='button' onClick={()=>setNewVideoModal(true)}>add video</button> : null}
                {video.title !== '' && isOwner ? <>
                
                <button className='button' onClick={()=>playerRef.current?.seekTo(currentSec-5)}>-5s</button>
                <button className='button' onClick={handleResume}><Image alt='resume vid' src={'/play.svg'} width={20} height={20} /></button>
                <button className='button' onClick={handlePause}><Image alt='pasue vid' src={'/pause.svg'}  width={20} height={20} /></button>
                <button className='button' onClick={()=>playerRef.current?.seekTo(currentSec+5)}>+5s</button>
                <button style={{backgroundColor:'#a82a1e'}} className='button' onClick={handleCancel}>skip <Image alt='cancel vid' src={'/close.svg'}  width={20} height={20} /></button>
                </> : null }
                
                
              </>

            }

          </div>

      {
        newVideoModal && <AddVideo 
            playing={setIsPlaying} 
            owner={setIsOwner} 
            addVideo={setVideo} 
            socket={socket} 
            user={userNick.nick} 
            close={setNewVideoModal}   
          />
      }

      {
          userNick.nick === '' ? 
          <Nick currentUser={userNick} setNick={setUserNick} /> : 
          <Chat currentUser={userNick} socket={socket} />
      }
      

  
      
       
    </div>
  </>
  )
}

export default Home
