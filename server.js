var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));
var sockets = [];

io.sockets.on('connection', function (socket) {
    sockets.push(socket);
    
    socket.on('disconnect', function (){
       sockets.splice(sockets.indexOf(socket), 1); 
       updateRoster();
    });
    
    socket.on('click', function () {
       console.log("click"); 
    });
    
    socket.on('identify', function (name) {
       socket.set('name', String(name || 'Anonimous'), function (err) {
          updateRoster(); 
       });
    });
});

function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      socket.get('name', callback);
    },
    function (err, names) {
      broadcast('roster', names);
    }
  );
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("ClickBattle server listening at", addr.address + ":" + addr.port);
});