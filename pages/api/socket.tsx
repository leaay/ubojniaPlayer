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
        console.log('a user connected');

        socket.on("pause", () => {
          
          socket.broadcast.emit('stop')

        })

        socket.on("resume", () => {
            
            
          socket.broadcast.emit('res')

        })
        
        socket.on('newVid', (msg) => {
          
            socket.broadcast.emit('receive', msg)
        })

        socket.on('newChater', (msg) => {

          socket.broadcast.emit('newUser', msg)

        })
        socket.on('send', (msg) => {

          socket.broadcast.emit('in', msg)

        })

        

      })


    }
    res.end()
  }

export default SocketHandler;