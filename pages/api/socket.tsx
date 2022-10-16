import { NextApiRequest , NextApiResponse } from "next";
import { Server } from "socket.io";

export default function SocketHandler(req:any, res:any) {

    if(res.socket.server.io){

        console.log("Socket.io already initialized");
        res.end();
        return

    }

    console.log(res)

    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    
    io.on("connection", (socket) => {
        console.log(socket.id);
    })


}