import styles from '../styles/chat.module.scss'
import { useState, useEffect , ChangeEvent } from 'react';

interface prop{
    
    socket:any,
    currentUser:{
        nick:string,
        color:string
    }
}

interface messInfo{
    message:string,
    nick:string,
    color:string
}

const Chat = ({socket,currentUser}:prop) => {

    const [messages, setMessages] = useState<messInfo[]>([]);
    const [messageInput, setMessageInput] = useState<string>('');

    function handleMessage(){
        
        const sending = {
            message:messageInput,
            nick:currentUser.nick,
            color:currentUser.color
        }

        console.log(sending)
        setMessages([...messages , sending])
        socket.emit("send" , sending );
        setMessageInput('')
        
        
    }

    useEffect(()=>{

  
  

        socket.on('in',(msg:messInfo)=>{
            setMessages(prev => [...prev , msg])
        })

        

        return ()=> {
            socket.off('in')
        }
        
    },[])

    return(
        <div className={styles.body}>
            <div className={styles.messageBox}>
                {messages.map((message , index) => <span className={styles.msg} key={index}  ><p style={{color:`${message.color}`}}>{message.nick}</p> : {message.message}</span>)}
            </div>
            <div className={styles.inputsBox}>
                <input value={messageInput} type='text' placeholder='message' onChange={({target}:ChangeEvent<HTMLInputElement>)=>setMessageInput(target.value)}/>
                <button onClick={handleMessage} className='button'>send</button>
            </div>

            {/* {userNick.nick !== '' && <h1 style={{color:`${userNick.color}`}}>my nick: {userNick.nick}</h1>} */}
        </div>
    )

}

export default Chat