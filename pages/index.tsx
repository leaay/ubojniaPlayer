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
  const [users , setUsers] = useState<nick[]>([])
  const [newVideoModal , setNewVideoModal] = useState<boolean>(false)
  const [isOwner , setIsOwner] = useState<boolean>(false)

  const [vidDuration , setVidDuration] = useState<number>(0)
  const [currentSec , setCurrentSec] = useState<number>(0)

  const playerRef:any = useRef()

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

    if(isOwner){
      socket.emit('newVid' , {url:'' , title:"" , user: ''})
    }
    

  }

  function handleStream(sec:number){
    // console.log(sec.toFixed(0))
    if(isOwner){
    socket.emit('streamingVideo' , {sec:sec.toFixed(0) , streamedVideo:video})
    }
  }

  function handleTest(){
    
    playerRef.current?.seekTo(20)
  }

  // useEffect(()=>{
  //   if(userNick.nick !== ''){
          
  //         setUsers([...users , userNick])
  //         socket.emit("newChater",  userNick)
          
  //   }
  //   return
  // },[userNick])
  
  useEffect(() => {
      
    connectSocket();

    
    socket.on('receive', (msg:video) => {
      setVideo(msg)
      setIsOwner(false)
      setIsPlaying(true)
    })

    socket.on('stop', ()=>{
      setIsPlaying(false)
      setVidDuration(0)
      setCurrentSec(0)
    })

    socket.on('res', ()=>{
      setIsPlaying(true)
    })

    socket.on('newUser', (msg:{nick:string,color:string}) => {
        console.log(msg)
        setUsers((prev) => [...prev , msg])
        
  
    })

    socket.on('streamedVideo' ,(msg:{sec:number , streamedVideo:video})=>{

        if(isOwner){
          return
          
        }else{
          console.log(msg.sec)

          if(video.url !== msg.streamedVideo.url){
            setVideo(msg.streamedVideo)
            playerRef.current?.seekTo(msg.sec)
          }

          if(currentSec < msg.sec  && currentSec > msg.sec - 2 ){
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




  return (
    <div className={styles.pageBody} >
      <Head>
        <title>UBOJNIA PLAYER</title>
        <meta name="description" content="UBOJNIA PLAYER" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      
        <div className={styles.playerWrapper}>

            {/* <ReactPlayer 
             
              playing={isPlaying} 
              muted={isMuted}
              controls={false}
              url={video.url} 
              onPause={handlePause}
              onPlay={handleResume}
              height={"auto"}
              width={"100%"}
              style={{width:"100%" , maxWidth:'100vw' , aspectRatio:'16/9'}}
              onEnded={()=>{setIsPlaying(false) ; setVideo({url:"",title:"",user:""})}}
              onDuration={(duration)=>{setVidDuration(duration)}}
              onProgress={(progress)=>{setCurrentSec(Math.ceil(progress.playedSeconds)) ; handleStream(progress.playedSeconds)}}
              
            /> */}

            <Player
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
            {video.title === '' &&  <p    >no video playing right now</p>}

            {video.title !== '' && 
                <div>  
                    <h1>{video.title} </h1>
                    <button onClick={()=>setIsMuted(!isMuted)}>
                      <Image alt='mute or unmute' src={isMuted ? '/mute.svg' : '/unmute.svg'} width={40} height={40} /></button>
                    <h3>requested by: {video.user}</h3>
                </div>
            }

            </div>

          </div>

          <div className={styles.playerLinks}>

            {userNick.nick !== '' && 

              <>
                {video.title === '' ? <button className='button' onClick={()=>setNewVideoModal(true)}>add video</button> : null}
                <p> {currentSec}s z {vidDuration.toFixed(0)}s  </p>
              
                {/* <button onClick={handleTest}>+10</button> */}
                {video.title !== '' && isOwner ? <>
                <button className='button' onClick={handleResume}>play <Image alt='resume vid' src={'/play.svg'} width={20} height={20} /></button>
                <button className='button' onClick={handlePause}>pause <Image alt='pasue vid' src={'/pause.svg'}  width={20} height={20} /></button>
                <button style={{backgroundColor:'#a82a1e'}} className='button' onClick={handleCancel}>cancel <Image alt='cancel vid' src={'/close.svg'}  width={20} height={20} /></button>
                </> : null }
                
                
              </>

            }

          </div>

      {
        newVideoModal && <AddVideo playing={setIsPlaying} owner={setIsOwner} addVideo={setVideo} socket={socket} user={userNick.nick} close={setNewVideoModal} />
      }

      {
          userNick.nick === '' ? 
          <Nick setNick={setUserNick} /> : 
          <Chat currentUser={userNick} socket={socket} />
      }
      

  
      
       
    </div>
  )
}

export default Home
