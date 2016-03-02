var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');

var port = process.env.PORT || process.env.NODE_PORT || 3000;

var client = fs.readFileSync(__dirname + "/../client/client.html");

server.listen(port);
console.log(`Listening on port:${port}`);
