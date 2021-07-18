const socket = io();

const videoGrid = document.getElementById('video-grid');

const myVideo = document.createElement('video');
myVideo.muted = true;
let myVideoStream;

var peer = new Peer( undefined, 
  {path: '/peerjs',
    host: '/', 
    port: 5000
    }
); 

navigator.mediaDevices.getUserMedia({
 video: true, 
 audio: true
})
.then(stream =>  {
   myVideoStream = stream;
  addVideoStream(myVideo, stream);

  peer.on('call', (call) => {
   
      call.answer(stream); // Answer the call with an A/V stream.
      const video = document.createElement('video');
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
       })
    
  });

  socket.on('user-connected', (userId) => 
  {
    connectToNewUser(userId, stream);
  })
})
.catch(err => {
   console.log(err.name + ": " + err.message); 
})

peer.on('open', id => {
  //console.log('My peer ID is: ' + id);
  socket.emit('join-room', ROOM_ID, id)
});





const connectToNewUser = (userId,stream) =>{
 const call = peer.call(userId, stream);
 const video = document.createElement('video');
 call.on('stream', userVideoStream => {
  addVideoStream(video, userVideoStream);
 })
}


const addVideoStream =  (video, stream) =>{
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  })
  videoGrid.append(video)
  
}

let text = $('input');

$('html').keydown(e => {
  if(e.which ==13  && text.val().length !== 0){
    console.log(text.val());
    socket.emit('message', text.val());
    text.val('');
  }
})


socket.on('createMessage', message=> {
  console.log('this is coming from server....', message);
  $('ul').append(`<li class="message"><b>user</b>  ${message}</li>`);
  scrollToBottom();
});

const scrollToBottom = () => {
  let d = $('.main__chat__window');
  d.scrollTop(d.prop('scrollHeight'))
}

//mute video
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  console.log(`xxxx...${enabled}`)
  if(enabled){
    myVideoStream.getAudioTracks()[0].enabled = false;
    setMuteButton();
  }else{
    setUnmuteButton();
    myVideoStream.getAudioTracks()[0].enabled=true;
  }
}

const setUnmuteButton = ()=>{
   console.log('clicked unmute...');
   const html =   `
    <i class="fas fa-microphone"></>
    <span>Mute</span>
  `;
   
  document.querySelector('.main__mute__button').innerHTML = html;
}


const setMuteButton = ()=>{
  console.log('clicked mute...');
  

   const html =   `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `;
  document.querySelector('.main__mute__button').innerHTML = html;
}