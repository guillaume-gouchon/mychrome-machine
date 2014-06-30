var PORT = 10000;

var app = require('http').createServer();
var server = app.listen(PORT);

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
      gameSocket.emit('pId', data.pId);
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

console.info("Mychrome Machines server is running on port " + PORT + " !");
