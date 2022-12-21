import {ChangeEvent,useState} from 'react';
import styles from '../styles/nick.module.scss'

interface prop{
    setNick:(nick:{
        nick:string,
        color:string
    })=>void,
}

const Nick = ({setNick}:prop) => {

    const [nickInput , setNickInput] = useState<string>('');
    const [color , setColor] = useState<string>('#FFFFFF');
    const colorsArray = [ '#c7b518' , '#4287f5'  , '#4ec938' ,  '#c71832']

    return(
        <div className={styles.body}>
            <input maxLength={20} type='text' value={nickInput} placeholder='nick' onChange={({target}:ChangeEvent<HTMLInputElement>)=>setNickInput(target.value)}/>
            <div className={styles.colorsBox}>
                {colorsArray.map((colorValue , index) => <button 
                key={index} 
                onClick={()=>setColor(colorValue)}
                className={`${styles.color} , ${color === colorValue ? styles.activeColor : ''}`}
                >
                 <div  style={{backgroundColor:`${colorValue}`}} ></div>
                </button>)}
            </div>
            <button disabled={nickInput === '' ? true : false} className='button' onClick={()=>setNick({nick:nickInput,color:color})}>join</button>
        </div>
    )

}

export default Nick
