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

        console.log('connected')

        socket.on('message', msg => {
            socket.broadcast.emit('receive', msg)
        })

      })

    }
    res.end()
  }

export default SocketHandler;