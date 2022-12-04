import type { NextPage } from 'next'
import Image from 'next/future/image'
import Head from 'next/head'
import dynamic from 'next/dynamic'
const  ReactPlayer = dynamic(() => import('react-player/youtube'), { ssr: false })
import io from "socket.io-client";
import { useEffect , useState , ChangeEvent } from 'react';
import Chat from '../components/Chat';
import styles from '../styles/page.module.scss'
import Nick from '../components/Nick';
import AddVideo from '../components/AddVideo'

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
    socket.emit('newVid' , {url:'' , title:"" , user: ''})

  }

  useEffect(()=>{
    if(userNick.nick !== ''){
          
          setUsers([...users , userNick])
          socket.emit("newChater",  userNick)
          
    }
    return
  },[userNick])
  
  useEffect(() => {
      
    connectSocket();

    
    socket.on('receive', (msg:video) => {
      setVideo(msg)
      setIsOwner(false)
      setIsPlaying(true)
    })

    socket.on('stop', ()=>{
      setIsPlaying(false)
    })

    socket.on('res', ()=>{
      setIsPlaying(true)
    })

    socket.on('newUser', (msg:{nick:string,color:string}) => {
        console.log(msg)
        setUsers((prev) => [...prev , msg])
        
  
    })



    return ()=>{
      socket.off('receive'),
      socket.off('stop'),
      socket.off('res'),
      socket.off('connect'),
      socket.off('newUser')
  
    }
  }, []);




  return (
    <div className={styles.pageBody} >
      <Head>
        <title>testing socket.io</title>
        <meta name="description" content="testing socket.io" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      
        <div className={styles.playerWrapper}>
            <ReactPlayer 
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
                
                {video.title !== '' && isOwner ? <>
                <button className='button' onClick={handleResume}>play <Image alt='resume vid' src={'/play.svg'} width={20} height={20} /></button>
                <button className='button' onClick={handlePause}>pause <Image alt='pasue vid' src={'/pause.svg'}  width={20} height={20} /></button>
                <button style={{backgroundColor:'#a82a1e'}} className='button' onClick={handleCancel}>cancel <Image alt='cancel vid' src={'/close.svg'}  width={20} height={20} /></button>
                </> : null }
                {/* <button className='button' onClick={()=>setNewVideoModal(true)}>add video</button> */}
                
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
