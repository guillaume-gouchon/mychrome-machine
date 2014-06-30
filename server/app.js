var PORT = 10000;
var express = require("express");
var http = require("http");

// server config
var app = module.exports = express();
app.configure(function () {
  app.use(express.compress());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var server = http.createServer(app);

// initializes Socket IO
app.io = require('socket.io').listen(server);
// removes debug logs
app.io.set('log level', 1);


// current games socket list
var games = {};

// init socket.io
app.io.sockets.on('connection', function (socket) {

  socket.on('newGame', function (data) {
    games[data] = socket;
  });

  socket.on('pId', function (data) {
    var gameSocket = games[data.gameId];
    if (gameSocket != null) {
      gameSocket.emit('pId', data.pId);
    }
  });

  socket.on('comm', function (data) {
     var gameSocket = games[data.gameId];
    if (gameSocket != null) {
      gameSocket.emit('comm', data.comm);
    }
  });

  socket.on('disconnect', function () {
    var disconnectedSocket = games[socket.id];
    if (disconnectedSocket != null) {
      console.log('destroying game...');
      delete games[socket.id];
    }
  });

});

server.listen(PORT);
console.info("Mychrome Machines server is running on port " + PORT + " !");
