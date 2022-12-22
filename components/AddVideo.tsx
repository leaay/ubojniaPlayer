
import styles from '../styles/addVideo.module.scss'
import { useState , ChangeEvent } from 'react';


interface prop {
    close: (i:boolean)=> void,
    user:string,
    socket:any,
    addVideo:(i:any)=>void,
    owner: (i:boolean)=>void,
    playing: (i:boolean)=>void,
    setCurrentSec:React.Dispatch<React.SetStateAction<number>>,
    setVideoProgress:React.Dispatch<React.SetStateAction<number>>,
    setStreamedSec:React.Dispatch<React.SetStateAction<number>>,
    setVidDuration:React.Dispatch<React.SetStateAction<number>>,
}


const AddVideo = ({close, user , socket , addVideo, owner , playing , setCurrentSec , setStreamedSec , setVidDuration , setVideoProgress}:prop) => {

    const [urlInput , setUrlInput] = useState<string>('')
    const [titleInput , setTitleInput] = useState<string>('')


    function handleSend(){

        addVideo({url:urlInput , title:titleInput , user})
        socket.emit('newVid' , {url:urlInput , title:titleInput , user})
        owner(true)
        playing(true)
        close(false)
        setCurrentSec(0)
        setStreamedSec(0)
        setVidDuration(0)
        setVideoProgress(0)


    }

    return(
        <div className={styles.addBody} onClick={()=>close(false)}>
            
            <div className={styles.addModal} onClick={(e)=>e.stopPropagation()}>
                    <h2>Video details</h2>
                    <input  onChange={({target}:ChangeEvent<HTMLInputElement>)=>setUrlInput(target.value)} type="text" placeholder="Video URL" />
                    <input onChange={({target}:ChangeEvent<HTMLInputElement>)=>setTitleInput(target.value)} type="text" placeholder="Video Title" />
                    <button onClick={handleSend} className='button'>Play</button>
            </div>
        </div>
    )
}

export default AddVideo