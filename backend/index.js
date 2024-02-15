const express = require('express');
const app = express();
const socket = require('socket.io');
const cors = require('cors');
const http = require("http");

app.use(cors());

let users = [{}];


const server = http.createServer(app);

const io= socket(server,{
    cors:{
        origin:"http://localhost:3000",
        methods: ["GET", "POST"]
    }
})


io.on("connection" , (socket)=>{
    console.log("New Connection");
    socket.on('joined',({user})=>{
      users[socket.id]=user;
      console.log(`${user} has joined `);
      socket.broadcast.emit('userJoined',{user:"AG :",message:` ${users[socket.id]} has joined`});
      socket.emit('welcome',{user:"AG :",message:`Welcome to the Chat,${users[socket.id]} `})
    })

    socket.on('message',({message,id})=>{
      console.log(message);
        io.emit('sendMessage',{user:users[id],message,id});
    })
    
    socket.on('disconnect',()=>{
        socket.broadcast.emit('leave',{user:"AG :",message:`${users[socket.id]}  has left`});
        console.log(`user left`);
    })
    
})


server.listen(4000);