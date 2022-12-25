
import styles from '../styles/addVideo.module.scss'
import { useState , ChangeEvent } from 'react';
import ReactPlayer from "react-player/lazy";
import { toast} from 'react-toastify';

interface prop {
    close: (i:boolean)=> void,
    user:string,
    socket:any,
    addVideo:(i:any)=>void,
    owner: (i:boolean)=>void,
    playing: (i:boolean)=>void,

}


const AddVideo = ({close, user , socket , addVideo, owner , playing  }:prop) => {

    const [urlInput , setUrlInput] = useState<string>('')
    const [titleInput , setTitleInput] = useState<string>('')

    const isInvalid = urlInput === '' || titleInput === '';

    function handleSend(){

        if(ReactPlayer.canPlay(urlInput)){
            
            addVideo({url:urlInput , title:titleInput , user})
            socket.emit('newVid' , {url:urlInput , title:titleInput , user})
            owner(true)
            playing(true)
            close(false)
        }else{
            toast.error('Invalid URL')
            close(false)
            return
            
        }
    }

    return(
        <>
        
        <div className={styles.addBody} onClick={()=>close(false)}>
            
            <div className={styles.addModal} onClick={(e)=>e.stopPropagation()}>
                    <h2>Video details</h2>
                    <input  onChange={({target}:ChangeEvent<HTMLInputElement>)=>setUrlInput(target.value)} type="text" placeholder="Video URL" />
                    <input onChange={({target}:ChangeEvent<HTMLInputElement>)=>setTitleInput(target.value)} maxLength={30} type="text" placeholder="Video Title" />
                    <button disabled={isInvalid} onClick={handleSend} className='button'>Play</button>
            </div>
        </div>
        </>
    )
}

export default AddVideo