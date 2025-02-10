import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
const  app=express();
const port=3000;
const server=createServer(app);
const io=new Server(server,{cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,}
});
io.on('connection',(socket)=>{
    console.log(`New user connected ${socket.id}`);

    socket.on('message',({message,RoomID})=>{
        console.log({message,RoomID});
      socket.to(RoomID).emit('receive-message',{message,RoomID});
    });
    socket.on('join-room',(RoomID)=>{
        socket.join(RoomID);
        console.log(`User joined room ${RoomID}`);
    });
    socket.on('disconnect',()=>{
        console.log(`User disconnected ${socket.id}`);
    }); 
})

server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
