var socket;
var connect;
var send;
var host;

/// Connects to the socketIo lib and establishes responses
var connectSocket = () => {
  var username = document.querySelector('#userName').value;
  if(!username){
    alert("You need to input a username");

  } else{

    socket = io.connect();
    socket.emit('join', {name:username});

    socket.on('new', data => {
      console.log(data);
      if(data.name){
        var newUser = document.createElement('div');

        var newLabel = document.createElement('span');
        newLabel.innerHTML = data.name;

        var newCan = document.createElement('canvas');
        newCan.setAttribute('id',data.name);
        newCan.setAttribute('sId', data.sId);
        newCan.setAttribute('width', '40%');
        newCan.setAttribute('height', '40%');

        newUser.appendChild(newLabel);
        newUser.appendChild(newCan);
        document.body.appendChild(newUser);
      }
    });

    socket.on('remove', data => {
      var tar = document.querySelector(`#${data.name}`);
      var container = tar.parentNode;
      document.body.removeChild(container);
    });

    socket.on('updateClient', data => {
      // grab the right canvas and update it... somehow
    });

    socket.on('clearPara', data => {
      console.log("Clear something maybe...");
    });
  }

  window.onbeforeunload = _ =>{
    socket.emit('leaving', {name:username});
  };

  connect.style.display = 'none';
  send.style.display = 'inline';
};

/// Sends the message to the server
var sendMessage = () => {
  socket.emit('msg', {data:"stuff"});
};

var paintLocalSetup = () => { // Code from William Malone at http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/
  var hostContext = host.getContext('2d');
  var paint;

  var clickX = [];
  var clickY = [];
  var clickDrag = [];

  host.addEventListener('mousedown', e => {
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;

    paint = true;
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    redraw();
  });

  host.addEventListener('mousemove', e => {
    if(paint){
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
      redraw();
    }
  });

  host.addEventListener('mouseup', e => {
    paint = false;
  });

  host.addEventListener('mouseleave', e => {
    paint = false;
  });

  var addClick = (x, y, dragging) => {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
  };

  var redraw = () => {
    hostContext.clearRect(0, 0, hostContext.canvas.width, hostContext.canvas.height); // Clears the canvas
    hostContext.strokeStyle = "#3500E3";
    hostContext.lineJoin = "round";
    hostContext.lineWidth = 5;

    for(var i=0; i < clickX.length; i++) {
      hostContext.beginPath();
      if(clickDrag[i] && i){
        hostContext.moveTo(clickX[i-1], clickY[i-1]);
      }else{
        hostContext.moveTo(clickX[i]-1, clickY[i]);
      }
      hostContext.lineTo(clickX[i], clickY[i]);
      hostContext.closePath();
      hostContext.stroke();
    }
  };

};

var init = () => {
  connect = document.querySelector("#join");
  send = document.querySelector("#send");
  host = document.querySelector("#host");
  connect.addEventListener('click',connectSocket);
  send.addEventListener('click',sendMessage);
  paintLocalSetup();
};


window.onload=init;
