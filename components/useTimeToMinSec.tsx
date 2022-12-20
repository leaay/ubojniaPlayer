

const useTimeToMinSec = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    
    return { min, sec };
}

export default useTimeToMinSec;