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
        socket.emit("send" );
        setMessageInput('')
        
        
    }

    useEffect(()=>{

  
  

        socket.on('in',()=>{
            console.log("msg.message")
        })

        

        return ()=> {
            socket.off('in')
        }
        
    },[])

    return(
        <div className={styles.body}>
            <div className={styles.messageBox}></div>
            <div className={styles.inputBox}>
                <input value={messageInput} type='text' placeholder='message' onChange={({target}:ChangeEvent<HTMLInputElement>)=>setMessageInput(target.value)}/>
                <button onClick={handleMessage} className='button'>send</button>
            </div>

            {/* {userNick.nick !== '' && <h1 style={{color:`${userNick.color}`}}>my nick: {userNick.nick}</h1>} */}
        </div>
    )

}

export default Chat