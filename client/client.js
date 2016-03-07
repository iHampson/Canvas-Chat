var socket;

/// Connects to the socketIo lib
function setupSocket(){
  var username = document.querySelector('#userName').value;
  if(!username){
    alert("You need to input a username");

  } else{

    socket = io.connect();
    socket.emit('join', {name:username});

    socket.on('new', function(data){
      console.log(data);
    });
    socket.on('updateClient', function(data){
      // grab the right canvas and update it... somehow
    });

    socket.on('clearPara',function(data){
      console.log("Clear something maybe...");
    });
  }
}

function init(){
  var connect = document.querySelector("#join");
  connect.addEventListener('click',setupSocket);
}

function sendMessage(){
  socket.emit('msg', {data:"stuff"});
}

window.onload=init;
