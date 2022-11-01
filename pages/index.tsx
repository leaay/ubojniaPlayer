import type { NextPage } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'

const  ReactPlayer = dynamic(() => import('react-player/youtube'), { ssr: false })
import io from "socket.io-client";
import { useEffect , useState , ChangeEvent } from 'react';

const socket = io();

const Home: NextPage = () => {

  const [inputValue , setInputValue] = useState("");
  const [test , setTest] = useState("");
  const [video , setVideo] = useState("");
  const [receivedVideo , setRecivedVideo] = useState("")
  const [isPlaying , setIsPlaying] = useState<boolean>(true)
 
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
    setIsPlaying(false)
    socket.emit("pause")

    
  }

  function handleResume(){
    setIsPlaying(true)
    socket.emit("resume")

    
  }

  

  
  useEffect(() => {
      
    connectSocket();
    

    socket.on('receive', (msg:string) => {

      console.log(test)
      setIsPlaying(true)
      setRecivedVideo(msg)

    })

    socket.on('stop', ()=>{

      console.log('elo')
      setIsPlaying(false)


    })

    socket.on('res', ()=>{
      console.log('play')
      setIsPlaying(true)
    })



    return ()=>{
      socket.off('receive'),
      socket.off('stop'),
      socket.off('res')
    }

  
  }, []);




  return (
    <div >
      <Head>
        <title>testing socket.io</title>
        <meta name="description" content="testing socket.io" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <input value={inputValue} type='text' onChange={({target}:ChangeEvent<HTMLInputElement>)=>setInputValue(target.value)}/>
      <button onClick={handleClick}>send</button>
      {/* <button onClick={handlePause}>pasue</button>
      <button onClick={handleResume}>resume</button> */}
      <p>{receivedVideo}</p>
  
     
      <ReactPlayer 
        playing={isPlaying} 
        muted={true}
        controls={false}
        url={video === '' ? receivedVideo : video} 
        onPause={handlePause}
        onStart={handleResume}
      />
      
      

    </div>
  )
}

export default Home
