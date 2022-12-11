import styles from '../styles/chat.module.scss'
import { useState, useEffect , ChangeEvent , useRef, useLayoutEffect } from 'react';
import useResize from './useResize';

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
    const [chatHeight, setChatHeight] = useState<string>('100%');
    const [width, height] = useResize();
    const messageBox = useRef<HTMLDivElement>(null)
    


    function handleMessage(){
        console.log(messageBox.current?.clientHeight)
        
        const sending = {
            message:messageInput,
            nick:currentUser.nick,
            color:currentUser.color
        }

        if(messages.length >= 50){
            setMessages(prev => [...prev.slice(2) , sending])

        }else{
            setMessages([...messages , sending])
        }
       
        
        socket.emit("send" , sending );
        setMessageInput('')
        
        
    }

    useLayoutEffect(() => {

        setChatHeight(`${messageBox.current?.clientHeight}px`)
   

    },[width,height])



    useEffect(()=>{

  
  

        socket.on('in',(msg:messInfo)=>{
            
            if(messages.length >= 50){
                console.log('in')
                setMessages(prev => [...prev.slice(1) , msg])
            }else{
                setMessages(prev => [...prev , msg])
            }
            
        })

        

        return ()=> {
            socket.off('in')
        }
        
    },[])

    return(
        <div className={styles.body}>
                <div ref={messageBox} className={styles.messageBoxWrapper}>
                    <div  style={{maxHeight:`${chatHeight}`}}  className={styles.messageBox}>
                        {messages.map((message , index) => <span className={styles.msg} key={index}  ><p style={{color:`${message.color}`}}>{message.nick}</p> : {message.message}</span>)}
                        
                    </div>
                </div>
            <div className={styles.inputsBox}>
                <input 
                    onKeyPress={({key})=>{if(key === 'Enter' && messageInput !== ''){handleMessage()}}} 
                    maxLength={30} 
                    value={messageInput} 
                    type='text' 
                    placeholder='message' 
                    onChange={({target}:ChangeEvent<HTMLInputElement>)=>setMessageInput(target.value)}/>

                <button disabled={messageInput === '' ? true : false}  onClick={handleMessage} className='button'>send</button>
            </div>

        </div>
    )

}

export default Chat