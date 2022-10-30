import type { NextPage } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import Image from 'next/image'
// import ReactPlayer from 'react-player/youtube'
const  ReactPlayer = dynamic(() => import('react-player/youtube'), { ssr: false })
import io from "socket.io-client";
import { useEffect , useState , ChangeEvent } from 'react';
let socket:any;

const Home: NextPage = () => {

  const [inputValue , setInputValue] = useState("");
  const [video , setVideo] = useState("");
  const [receivedVideo , setRecivedVideo] = useState("")
 
  async function connectSocket() {

    await fetch("/api/socket");

  }

  function handleClick(){
    setVideo(inputValue)
    socket.emit("message" , video);
    console.log()
    setInputValue("");
  }
  

  
  useEffect(() => {
      
    connectSocket();
    socket = io();

    socket.on('connect', () => {
      console.log(socket)
    })

    socket.on('receive', (msg:string) => {

      console.log(msg)
      setRecivedVideo(msg)

    })

  
  }, []);


  return (
    <div >
      {/* <Head>
        <title>testing socket.io</title>
        <meta name="description" content="testing socket.io" />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}

      <p>send message to all users conneted to this site</p>
      <input value={inputValue} type='text' onChange={({target}:ChangeEvent<HTMLInputElement>)=>setInputValue(target.value)}/>
      <button onClick={handleClick}>send</button>

     
      <ReactPlayer url={video === '' ? receivedVideo : video} />
      
      

    </div>
  )
}

export default Home
