var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');

var port = process.env.PORT || process.env.NODE_PORT || 3000;

var client = fs.readFileSync(__dirname + "/../client/client.html");

server.listen(port);
console.log(`Listening on port:${port}`);

var init = () => {
  var cCount = 0;
  var users = { };

  var OnJoin = socket => {
    socket.on('join',data => {
      cCount += 1;
        io.sockets.in('room1').emit('new',{name:data.name, sId:socket.id});
        socket.join('room1');
        console.log("joined room1");
        if(cCount !== 1){
          for(var key in users){
            console.log(users[key]);
            socket.emit('new', users[key]);
          }
        }
        users[data.name] = {name:data.name, sId:socket.id};
    });

    socket.on('leaving', data => {
      socket.broadcast.emit('remove',{name : data.name});
      delete users[data.name];
      socket.leave('room1');
    });
  };

  var OnMsg = socket => {
    socket.on('msg',data => {
      socket.broadcast.emit('response',data);
    });
  };

  app.get('/', (req, res) => {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write(client);
    res.end();
  });

  app.get('/client/client.js', (req,res) => {
    res.writeHead(200, {"Content-Type": "application/javascript"});
    res.write(fs.readFileSync(__dirname+"/../client/client.js"));
    res.end();
  });

  io.sockets.on("connection", socket => {
    OnJoin(socket);
    OnMsg(socket);
  });


}();
