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
		socket = io.connect('http://localhost:1234');

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

		// gamepads
		// TODO

		//keyboard
		document.addEventListener('keydown', function (event) {
			if (event.keyCode == 81) {
				if (players.length < 8) {
					var keyboardPlayerIndex = players.indexOf(KEYBOARD_PLAYER);
					if (keyboardPlayerIndex == -1) {
						addPlayer(KEYBOARD_PLAYER);					
					} else {
						removePlayer(keyboardPlayerIndex);
					}
				}
			}
		});

		$('#startGameBtn').click(function () {
			if (players.length > 1) {
		    	startGame(players.length, 1);
			}
		})
	}

});

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

	// init phone pad commands receiver
	socket.on('commands', function (commands) {
		game.input.inputs[commands.id] = commands;
	});

	game.start();
}

function restartGame() {
	startGame(game.nbPlayers, game.race.id);
}

function addPlayer(playerType) {
	var player = new Player(players.length, playerType);
	players.push(player);
	updatePlayersLayout();
}

function removePlayer(index) {
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
		switch(player.id) {
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
