var socket;
var username;
var connect;
var send;
var host;
var clickX;
var clickY;
var clickDrag;
/// Connects to the socketIo lib and establishes responses
var connectSocket = () => {
  username = document.querySelector('#userName').value;
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
        newLabel.style.display = "block";

        var newCan = document.createElement('canvas');
        newCan.setAttribute('id',data.name);
        newCan.setAttribute('sId', data.sId);
        newCan.setAttribute('class', 'other');
        newCan.setAttribute('width', '100%');
        newCan.setAttribute('height', '100%');

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

    socket.on('response', data => {
      // grab the right canvas and update it... somehow
      var tar = document.querySelector(`#${data.name}`);
      var tarContext = tar.getContext("2d");
      // redraw(tar, data.clickX, data.clickY, data.clickDrag);
      var image = new Image();
      image.onload = function(){
        tarContext.save();
        tarContext.globalCompositeOperation = "sorce-over"; // Canvas default
        tarContext.drawImage(image, 0, 0, tar.width, tar.height);
        tarContext.restore();
      };
      image.src = data.image;
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
  var img = host.toDataURL();
  socket.emit('msg', {name:username, image:img}); //clickX:clickX, clickY:clickY, clickDrag:clickDrag});
  var hostCon = host.getContext("2d");
  hostCon.clearRect(0,0,500,500);
};

var paintLocalSetup = () => { // Code from William Malone at http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/
  var paint;
  clickX = [];
  clickY = [];
  clickDrag = [];

  host.addEventListener('mousedown', e => {
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;

    paint = true;
    addClick(mouseX, mouseY, false);
    redraw(host, clickX, clickY, clickDrag);
  });

  host.addEventListener('mousemove', e => {
    if(paint){
      var mouseX = e.pageX - 8;
      var mouseY = e.pageY - 50;
      addClick(mouseX, mouseY, true);
      redraw(host, clickX, clickY, clickDrag);
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
};

var redraw = (tar, clickX, clickY, clickDrag) => {
  var context = tar.getContext("2d");
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
  context.strokeStyle = "#3500E3";
  context.lineJoin = "round";
  context.lineWidth = 5;

  for(var i=0; i < clickX.length; i++) {
    context.beginPath();
    if(clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
    }else{
      context.moveTo(clickX[i]-1, clickY[i]);
    }
    context.lineTo(clickX[i], clickY[i]);
    context.closePath();
    context.stroke();
  }
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
