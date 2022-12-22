
import ReactPlayer from "react-player/lazy";

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
    playerRef:any,
    setVideoProgress:React.Dispatch<React.SetStateAction<number>>,

}

const Player = ({isPlaying ,setVideoProgress, setIsPlaying , setVidDuration , setCurrentSec , handleStream , setVideo , isMuted , video , handleResume , handlePause , socket , playerRef}:prop) => {

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
          // onEnded={()=>{setIsPlaying(false) ; setVideo({url:"",title:"",user:""}) ; setVideoProgress(0) ; console.log('ended')}}
          onDuration={(duration)=>{setVidDuration(duration)}}
          onProgress={(progress)=>{
            setCurrentSec(progress.playedSeconds);
            handleStream(progress.playedSeconds); 
            setVideoProgress(Number(progress.played.toFixed(2)))
          }}
      />
    )

}



export default Player