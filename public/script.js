const socket = io();

const videoGrid = document.getElementById('video-grid');

const myVideo = document.createElement('video');
myVideo.muted = true;
let myVideoStream;

console.log('xxxx')

navigator.mediaDevices.getUserMedia({
 video: true, 
 audio: true
})
.then(stream =>  {
   myVideoStream = stream;
    addVideoStream(myVideo, stream);
})
.catch(err => {
   console.log(err.name + ": " + err.message); 
})

socket.emit('join-room', ROOM_ID)

socket.on('user-connected', () => {
  connectToNewUser();
})

const connectToNewUser = () =>{
  console.log('new user');
}

const addVideoStream =  (video, stream) =>{
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  })
  videoGrid.append(video)
  
}