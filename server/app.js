var express = require("express");
var randomWords = require('random-words');

// server config
var app = module.exports = express();
app.configure(function () {
  app.use(express.compress());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// console colors
var colors = require('colors');
colors.setTheme({
  error: 'red',
  api: 'cyan',
  success: 'green',
  info: 'yellow',
  debug: 'grey'
});

// start server
var port = 443;
var server = app.listen(port);

// initializes Socket IO
app.io = require('socket.io').listen(server);
// removes debug logs
app.io.set('log level', 1);


// current games list
var games = {};

function Game (socket) {
  this.socket = socket;
  this.players = [];
}

// init socket.io
app.io.sockets.on('connection', function (socket) {

  socket.on('createGame', function () {
    console.log('creating game...'.debug);
    var randomGameId = null;
    do {
      randomGameId = randomWords();
    } while (games[randomGameId] != null || randomGameId.length > 5);
    
    games[randomGameId] = new Game(socket);
    socket.emit('gameCreated', randomGameId);
  });

  socket.on('joinGame', function (data) {
    var game = games[data.gameId];
    if (game != null) {
      console.log('a phonepad joined game '.debug + data.gameId);
      var playerId = data.playerId;
      if (playerId == null) {
        // new player
        socket.emit('gameAccepted', game.players.length);
        game.socket.emit('playerJoined');
        game.players.push(socket);
      } else {
        // player reconnection
        socket.emit('gameAccepted', playerId);
        game.players[playerId] = socket;
      }      
    } else {
      socket.emit('gameNotFound');
    }
  });

  socket.on('updatePlayers', function (data) {
    console.log('update players for game '.debug + data.gameId);
    var game = games[data.gameId];
    if (game != null) {
      if (data.playerIndex != null) {
        game.players.splice(data.playerIndex, 1);
      } else {
        game.players.push('offlinePlayer');
      }

      for (var i in game.players) {
        var playerSocket = game.players[i];
        if (playerSocket != 'offlinePlayer') {
          playerSocket.emit('updatePlayerId', i);
        }
      }
    }
  });

  socket.on('commands', function (data) {
    var game = games[data.gameId];
    if (game != null) {
      game.socket.emit('commands', data.commands);
    }
  });

  socket.on('disconnect', function () {
    var l = games.length;
    for (var i = 0; i < l; i++) {
      var game = games[i];
      if (socket.id == game.socket.id) {
        console.log('destroying game '.debug + i + '...'.debug);
        games.splice(i, 1);
        return;
      }
    }
  });

});

console.log("Mychrome Machines server is running on port ".green + port + " !".green);
