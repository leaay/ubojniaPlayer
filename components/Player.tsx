
// const  ReactPlayer = dynamic(() => import('react-player/youtube'), { ssr: false })
import ReactPlayer from "react-player/lazy";

// import dynamic from 'next/dynamic'
interface prop{
    isPlaying:boolean,
    setIsPlaying:React.Dispatch<React.SetStateAction<boolean>>,
    setVidDuration:React.Dispatch<React.SetStateAction<number>>,
    setCurrentSec:React.Dispatch<React.SetStateAction<number>>,
    handleStream:(sec:number)=>void,
    setVideo:React.Dispatch<React.SetStateAction<{ url: string; title: string; user: string; }>>,
    isMuted:boolean,
    video:{ url: string; title: string; user: string; },
    handleResume:()=>void,
    handlePause:()=>void,
    socket:any,
    playerRef:any

}

const Player = ({isPlaying , setIsPlaying , setVidDuration , setCurrentSec , handleStream , setVideo , isMuted , video , handleResume , handlePause , socket , playerRef}:prop) => {

    return (
        <ReactPlayer 
        ref={playerRef}
        playing={isPlaying} 
        muted={isMuted}
        controls={false}
        url={video.url} 
        onPause={handlePause}
        onPlay={handleResume}
        height={"auto"}
        width={"100%"}
        style={{width:"100%" , maxWidth:'100vw' , aspectRatio:'16/9'}}
        onEnded={()=>{setIsPlaying(false) ; setVideo({url:"",title:"",user:""})}}
        onDuration={(duration)=>{setVidDuration(duration)}}
        onProgress={(progress)=>{setCurrentSec(Math.ceil(progress.playedSeconds)) ; handleStream(progress.playedSeconds)}}
        
      />
    )

}


{/* <ReactPlayer 
             
             playing={isPlaying} 
             muted={isMuted}
             controls={false}
             url={video.url} 
             onPause={handlePause}
             onPlay={handleResume}
             height={"auto"}
             width={"100%"}
             style={{width:"100%" , maxWidth:'100vw' , aspectRatio:'16/9'}}
             onEnded={()=>{setIsPlaying(false) ; setVideo({url:"",title:"",user:""})}}
             onDuration={(duration)=>{setVidDuration(duration)}}
             onProgress={(progress)=>{setCurrentSec(Math.ceil(progress.playedSeconds)) ; handleStream(progress.playedSeconds)}}
             
           /> */}

export default Player