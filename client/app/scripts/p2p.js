var PEER_API_KEY = '609xv5np9cu15rk9';
var peer = null;
var conn = null;

var MESSAGE_TYPES = {
	playerId: 0,
	commands: 1
};

function createReceiver() {
	peer = new Peer(gameId, { key: PEER_API_KEY });
	
	// listens for phonepads connections
	peer.on('connection', function (conn) {

		// register message receiver
		conn.on('data', function (data) {
			switch(data.type) {
				case MESSAGE_TYPES.playerId:
					console.log('Receiving player id...');
					addPlayer(PHONEPAD_PLAYER, data.content);
					break;
				case MESSAGE_TYPES.commands:
					console.log('Receiving commands...');
					var commands = JSON.parse(data.content);
					if (game != null) {
				  	players[getPlayerIndex(commands.id)].commands = commands;
					} else {
						if (commands.accelerate || commands.turnRight || commands.turnLeft || commands.brake) {
							$('#playersList div:nth(' + getPlayerIndex(commands.id) + ')').addClass('bounce');
						} else {
							$('#playersList div:nth(' + getPlayerIndex(commands.id) + ')').removeClass('bounce');
						}
					}
					break;
			}
		
	  });

	  // remove disconnected players
	  conn.on('close', function () {
	  	console.log('A player has been disconnected');
	  });

	});
}

function connectToGame(gameId, playerId, onConnected) {
	console.log('Joining game...')
	peer = new Peer(null, {key: PEER_API_KEY});

	// connect to game
	conn = peer.connect(gameId);

	conn.on('open', function () {
		if (playerId == null) {
			console.log('Generating unique player id...');
			playerId = generateUUID();
		}
		console.log('Player id is', playerId);

	  // send player id to game
	  var message = buildMessage(MESSAGE_TYPES.playerId, playerId);
	  conn.send(message);

	  onConnected(playerId);
	});
}

function sendCommands(commands) {
	var message = buildMessage(MESSAGE_TYPES.commands, JSON.stringify(commands));
  conn.send(message);
}

function buildMessage(type, content) {
	return {
		type: type,
		content: content
	}
}
