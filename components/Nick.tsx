import {ChangeEvent,useState , useLayoutEffect} from 'react';
import styles from '../styles/nick.module.scss'
import { setCookie , getCookie } from 'cookies-next';

interface prop{
    setNick:(nick:{
        nick:string,
        color:string
    })=>void,
    currentUser:any
}

const Nick = ({setNick , currentUser}:prop) => {

    const [nickInput , setNickInput] = useState<string>('');
    const [color , setColor] = useState<string>('#FFFFFF');
    const colorsArray = [ '#c7b518' , '#4287f5'  , '#4ec938' ,  '#c71832']


    function handleUser(){

        setCookie('user' , {nick:nickInput , color:color})
        setNick({nick:nickInput,color:color})

    }

    useLayoutEffect(()=>{

        const data = getCookie('user');
        if(data){
        
        setNick(JSON.parse(data as any))
        }

    },[])

    


    return(
        <div className={styles.body}>
            <input maxLength={15} type='text' value={nickInput} placeholder='nick' onChange={({target}:ChangeEvent<HTMLInputElement>)=>setNickInput(target.value)}/>
            <div className={styles.colorsBox}>
                {colorsArray.map((colorValue , index) => <button 
                key={index} 
                onClick={()=>setColor(colorValue)}
                className={`${styles.color} , ${color === colorValue ? styles.activeColor : ''}`}
                >
                 <div  style={{backgroundColor:`${colorValue}`}} ></div>
                </button>)}
            </div>
            <button disabled={nickInput === '' ? true : false} className='button' onClick={handleUser}>join</button>
        </div>
    )

}

export default Nick
