var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');

var port = process.env.PORT || process.env.NODE_PORT || 3000;

var client = fs.readFileSync(__dirname + "/../client/client.html");

server.listen(port);
console.log(`Listening on port:${port}`);

const init = () => {
  var roomCount = 0;
  var cCount = 0;
  var users = { };

  var OnJoin = socket => {
    socket.on('join',function(data){
      cCount += 1;
      if(roomCount <5){
        io.sockets.in('room1').emit('new',{name:data.name});
        socket.join('room1');
        console.log("joined room1");
        if(cCount !== 1){
          console.log('Sending previously connected users');
          for(var key in users){
            console.log(users[key]);
            socket.emit('new', key);
          }
          console.log('Users sent');
        }
        users[data.name] = {name:data.name, sId:socket.id};
        roomCount += 1;
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


}();
