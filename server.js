const express = require('express');
const { v4: uuidv4 } = require('uuid');
const socketio = require("socket.io");
const http = require('http');
const { ExpressPeerServer } = require('peer');

const app = express();
const server = http.createServer(app);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect(`/${uuidv4()}`);
})


app.get('/:room', (req, res) => {
  
  res.render('room', {roomId: req.params.room})
})

server.listen(5000);


// Socket setup
const io = socketio(server);

const peerServer = ExpressPeerServer(server, {debug: true});

app.use('/peerjs', peerServer);



io.on("connection", socket => {
  
  socket.on('join-room', (roomId, userId) => {
    
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);
    socket.on('message', message => {
      io.to(roomId).emit('createMessage', message)
    })
    console.log("Joined room");
  })
});

