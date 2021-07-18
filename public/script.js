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

//mute audio
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

//mute video
const playStop = () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
 
  if(enabled){
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  }else{
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled=true;
  }
}

const setUnmuteButton = ()=>{
   
   const html =   `
    <i class="fas fa-microphone"></>
    <span>Mute</span>
  `;
   
  document.querySelector('.main__mute__button').innerHTML = html;
}


const setMuteButton = ()=>{
 
   const html =   `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `;
  document.querySelector('.main__mute__button').innerHTML = html;
}

const setStopVideo = () => {
  const html =   `
    <i class="fas fa-video"></>
    <span>Stop Video</span>
  `;
   
  document.querySelector('.main__video__button').innerHTML = html;
}

const setPlayVideo = () =>{

  const html =   `
    <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `;
  document.querySelector('.main__video__button').innerHTML = html;

}

