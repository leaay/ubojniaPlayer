
import styles from '../styles/addVideo.module.scss'

interface prop {
    close: (i:boolean)=> void,
}


const AddVideo = ({close}:prop) => {

    return(
        <div className={styles.addBody} onClick={()=>close(false)}>
            <div className={styles.addModal} onClick={(e)=>e.stopPropagation()}>
                    <input type="text" placeholder="Video URL" />
                    <input type="text" placeholder="Video Title" />
                    <button className='button'>Play</button>
            </div>
        </div>
    )
}

export default AddVideo