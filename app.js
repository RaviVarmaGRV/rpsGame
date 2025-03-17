const express=require('express');
const app=express();
const path=require('path');
const pubDir=path.join(__dirname,"/public");

const socketio=require('socket.io');
const http=require('http');

var server=http.createServer(app);
var io=socketio(server);

app.use(express.static(pubDir));
app.set("view engine", "ejs");


app.get('/',(req,res)=>{
    res.render('home');
})

io.on("connection",(socket)=>{    
    socket.on('createRoom',(roomName)=>{
        socket.join(roomName);
        socket.broadcast.emit('otherConnection',"New one entered");
    })

    socket.on('checkLength',(roomName,callback)=>{
        io.in(roomName).fetchSockets().then((sockets) => {
            callback(sockets.length);

        });
    })

    socket.on('joinRoom',(roomName) => {
        const rooms = Array.from(io.of('/').adapter.rooms.keys());

        if (rooms.indexOf(roomName)>=0) {
            socket.emit('approvalGranted');
            socket.join(roomName);
        }
        else{
            socket.emit('approvalDenied');//add functionality
        }
    });

    socket.on('optionClicked',(option) => {
        socket.broadcast.emit('opponentOption',option);
    })

    socket.on('playAgainRestart',()=>{                        
        socket.broadcast.emit('playAgain');
    });

    
});

server.listen('3007',()=>{
    console.log('Port 3007 connected');  
})