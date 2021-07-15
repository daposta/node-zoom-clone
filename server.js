const express = require('express');
const { v4: uuidv4 } = require('uuid');
const socketio = require("socket.io");

const app = express();


app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect(`/${uuidv4()}`);
})


app.get('/:room', (req, res) => {
  //res.send('xxxx')
  res.render('room', {roomId: req.params.room})
})

const server = app.listen(5000, ()=> { 
  console.log(`Server has started at 5000`);
});


// Socket setup
const io = socketio(server);

io.on("connection", socket => {
  
  socket.on('join-room', (roomId) => {
    
    socket.join(roomId);
    socket.to(roomId).emit('user-connected');
    console.log("Joined room");
  })
});

