var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');

var port = process.env.PORT || process.env.NODE_PORT || 3000;

var client = fs.readFileSync(__dirname + "/../client/client.html");

server.listen(port);
console.log(`Listening on port:${port}`);

var OnJoin = socket => {
  socket.on('join',function(data){
    var rCount = io.sockets.adapter.rooms['room1'].length;
    if(rCount <4){
      socket.broadcast.in('room1').
      socket.join('room1');
      console.log("joined room1");
    } else{
      socket.join('overflow');
      console.log('room1 overflowed');
    }
  });
};

var OnMsg = socket => {

};

app.get('/', function(req, res){
  res.writeHead(200, {"Content-Type": "text/html"});
  res.write(client);
  res.end();
});

app.get('/client/client.js', function(req,res){
  res.writeHead(200, {"Content-Type": "application/javascript"});
  res.write(fs.readFileSync(__dirname+"/../client/client.js"));
  res.end();
});

io.sockets.on("connection",function(socket){
  OnJoin(socket);
  OnMsg(socket);
});
