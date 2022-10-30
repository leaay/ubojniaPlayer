import { NextApiRequest , NextApiResponse } from "next";
import { Server } from "socket.io";


const SocketHandler = (req:any , res:any) => {
    if (res.socket.server.io) {
      console.log('Socket is already running')
    } else {
      console.log('Socket is initializing')
      const io = new Server(res.socket.server)
      
      res.socket.server.io = io

      io.on('connection', (socket) => {
        
        socket.on('message', msg => {
          
            socket.broadcast.emit('receive', msg)
        })
      })

      io.on('pause', (socket)=>{
        console.log('pasue')
        socket.broadcast.emit('stop')
      })

    }
    res.end()
  }

export default SocketHandler;