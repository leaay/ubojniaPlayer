import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'


import io from "socket.io-client";
import { useEffect , useState , ChangeEvent } from 'react';
let socket:any;

const Home: NextPage = () => {

  const [value , setValue] = useState("");
 
  const [messages,setMessages] = useState<string[]>([]);
 
  async function connectSocket() {

    await fetch("/api/socket");

  }

  function handleClick(){
    socket.emit("message" , value);
    setMessages((prev)=>[...prev, value]);
    setValue("");
  }
  

  
  useEffect(() => {
      
    connectSocket();
    socket = io();

    socket.on('connect', () => {
      console.log(socket)
    })

    socket.on('receive', (msg:string) => {
      console.log(msg)
      setMessages((prev)=>[...prev, msg]);
      console.log(messages)
    })

  
  }, []);


  return (
    <div >
      <Head>
        <title>testing socket.io</title>
        <meta name="description" content="testing socket.io" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <p>connected users ids..</p>
      
      <input value={value} type='text' onChange={({target}:ChangeEvent<HTMLInputElement>)=>setValue(target.value)}/>
      <button onClick={handleClick}>send</button>
      <div className='box'>
      {messages.map((msg:string,index:number)=><p key={index}>{msg}</p>)}
      </div>
    </div>
  )
}

export default Home
