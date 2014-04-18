var ctx, screenwidth, screenheight;
var game = null;
var gameId = null;
var players = [];
var socket = null;

$(function() {
	if (Modernizr.touch && ($(window).height() <= 480 || $(window).width() <= 480)) {
	   // it is a phone : display phone pad !
	   $('#gamePad').removeClass('hide');
	   $('#game').remove();
	   	   FastClick.attach(document.body);

	   	// init phonepad
	   	var phonePad = new PhonePad();
	} else {
		// it is a screen : display game !
		$('#mainPage').removeClass('hide');
		$('#gamepad').remove();

		// animate title and cars
		setTimeout(function () {
			$('#logo h2').removeClass('farTop');
			$('#animatedCars').addClass('animated');
		}, 200);

		// phone pads
		try {
			socket = io.connect();
			console.log(socket.socket.connecting);
			console.log(socket.socket.connected);

			// create game
			socket.emit('createGame');

			// wait for response
			socket.on('gameCreated', function (myGameId) {
				gameId = myGameId;
				$('#gameId').html(gameId);
			});

			// phonepads
			socket.on('playerJoined', function () {
				addPlayer(PHONEPAD_PLAYER);
			});
			socket.on('playerLeft', function (playerIndex) {
				removePlayer(playerIndex);
			});
		} catch (e) {
			console.log(e);
		}

		// gamepads
		var gamepadHelper = new GamepadHelper();
		gamepadHelper.init();

		//keyboard
		document.addEventListener('keydown', addKeyboardPlayer);

		$('#startGameBtn').click(function () {
			if (players.length > 0) {
		    	startGame(players.length, 1);
			}
		})
	}

});

function addKeyboardPlayer (event) {
	if (game == null && players.length < 8) {
		for (var i in players) {
			if (players[i].type == KEYBOARD_PLAYER) {
				removePlayer(i);
				return;	
			}
		}
		addPlayer(KEYBOARD_PLAYER);
	}
}

function prepareCanvas() {
	var carCanvas = document.getElementById("cars");
	carCanvas.width = 800;
	carCanvas.height = 500;
	ctx = carCanvas.getContext("2d");
	screenwidth = carCanvas.width;
	screenheight = carCanvas.height;
}

function startGame(nbPlayers, raceId) {
	prepareCanvas();
	$('#mainPage').addClass('hide');
	$('#game').removeClass('hide');
	$('#bigMessage').removeClass('show');
	game = new Game(nbPlayers, new Race(raceId, 'car'));
	game.start();
}

function restartGame() {
	startGame(game.nbPlayers, game.race.id);
}

function addPlayer(playerType, extra) {
	var player = new Player(players.length, playerType, extra);
	players.push(player);
	updatePlayersLayout();
	if (socket != null && player.type != PHONEPAD_PLAYER) {
		socket.emit('updatePlayers', { gameId: gameId });
	}
}

function removePlayer(index) {
	var player = players[index];
	if (socket != null && player.type != PHONEPAD_PLAYER) {
		socket.emit('updatePlayers', { gameId: gameId, playerIndex: index });
	}
	players.splice(index, 1);
	updatePlayersLayout();
}

function updatePlayersLayout() {
	$('#playersList div').removeClass('active');
	$('#playersList div i').removeClass('fa-gamepad fa-mobile-phone fa-keyboard-o');
	for (var i = 0; i < players.length; i++) {
		var player = players[i];
		$('#playersList div:nth(' + i + ')').addClass('active');
		var element = $('#playersList div:nth(' + i + ') i');
		switch(player.type) {
			case GAMEPAD_PLAYER:
				element.addClass('fa-gamepad');
				break;
			case PHONEPAD_PLAYER:
				element.addClass('fa-mobile-phone');
				break;
			case KEYBOARD_PLAYER:
				element.addClass('fa-keyboard-o');
				break;
		}
	}
}


/**
*	GAME LOOP
*/
function animate() {

	game.input.checkInputs();
	
	game.update();

	clearCanvas();

	game.draw();

	if (!game.isPaused) {
		// request new frame
		requestAnimFrame(function () {
		  animate();
		});
	}

}

function clearCanvas() {
	ctx.clearRect(0, 0, screenwidth, screenheight);
}
