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

const socket = io();

interface nick{
    nick:string,
    color:string
}

const Home: NextPage = () => {

  const [inputValue , setInputValue] = useState("");
  const [video , setVideo] = useState("");
  const [isPlaying , setIsPlaying] = useState<boolean>(true)
  const [isMuted , setIsMuted] = useState<boolean>(true)
  const [userNick , setUserNick] = useState<nick>({nick:'',color:'#000000'});
  const [users , setUsers] = useState<nick[]>([])


  async function connectSocket() {
    await fetch("/api/socket");
  }


  function handleClick(){
    setVideo(inputValue)
    socket.emit("message" , inputValue);
    setIsPlaying(true)
    setInputValue("");
  }

  function handlePause(){
    socket.emit("pause")
    setIsPlaying(false)
  }

  function handleResume(){
    socket.emit("resume")
    setIsPlaying(true)
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
    console.log(socket)
    // socket.on("connect", () => {
    //   console.log(socket.id); 
    // });
    
    socket.on('receive', (msg:string) => {
      setVideo(msg)
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
          url={video} 
          onPause={handlePause}
          onPlay={handleResume}
          height={"auto"}
          width={"100%"}
          style={{width:"100%" , maxWidth:'100vw' , aspectRatio:'16/9'}}
          onEnded={()=>{setIsPlaying(false) ; setVideo("")}}
        />

        

        <div style={video==='' ? {opacity:'1'} : {opacity:'0'} } className={styles.playerOverlay}>
        {video === '' &&  <p >no video playing right now</p>}

        {video !== '' && 
            <button onClick={()=>setIsMuted(!isMuted)}>
              <Image alt='mute or unmute' src={isMuted ? '/mute.svg' : '/unmute.svg'} width={40} height={40} /></button>
        }

        </div>

     </div>

      <div className={styles.playerLinks}>
          <input value={inputValue} placeholder='yt link' type='text' onChange={({target}:ChangeEvent<HTMLInputElement>)=>setInputValue(target.value)}/>
          <button className='button' onClick={handleClick}>send</button>
          
      </div>

      {/* <button onClick={handlePause}>pasue</button>
      <button onClick={handleResume}>resume</button>
       */}

      {
          userNick.nick === '' ? 
          <Nick setNick={setUserNick} /> : 
          <Chat currentUser={userNick} socket={socket} />
      }
      

     
      {/* {users.map((user , index) => <p style={{color:`${user.color}`}} key={index}>{user.nick}</p>)} */}
      
       
    </div>
  )
}

export default Home
