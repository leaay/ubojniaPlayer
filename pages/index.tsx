import type { NextPage } from 'next'
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

  const [userInput , setUserInput] = useState<string>('');
  const [userNick , setUserNick] = useState<nick>({nick:'',color:'#000000'});
  const [users , setUsers] = useState<nick[]>([])


  async function connectSocket() {
    await fetch("/api/socket");
  }

  // function handleNick(){
  //   setUserNick(userInput)
  //   setUsers([...users , userInput])
  //   socket.emit("newChater", userInput)
  //   setUserInput('')
  // }

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


      
     
      <ReactPlayer 
        playing={isPlaying} 
        muted={true}
        controls={false}
        url={video} 
        onPause={handlePause}
        onPlay={handleResume}
        height={"auto"}
        width={"100%"}
        style={{width:"100%" , maxWidth:'100vw' , aspectRatio:'16/9', gridColumn:'2/3'}}
        
      />

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
