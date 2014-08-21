var ctx, screenwidth, screenheight;
var game = null;
var soundManager = null;
var players = [];

var IMAGES_PATH = '../images/';
var PLAYER_NAMES = ['Blue', 'Red', 'Yellow', 'Green'];
var PLAYER_START_POINTS = 3;
var MINIMUM_NB_PLAYERS = 2;


$(function() {

	// animate title and cars
	setTimeout(function () {
		$('#logo h2').removeClass('farTop');
	}, 200);

	$('#animatedCars').addClass('animated');

	// init sound
	soundManager = new SoundManager();
	// soundManager.init();

	// play music
	// soundManager.play(GAME_SOUNDS.mainMusic);

	// keyboard
	document.addEventListener('keydown', function (event) {
		if (event.keyCode == 13) {
			if (players.length >= MINIMUM_NB_PLAYERS) {
	    		startGame(players.length, 1);
			}
		}
	});

	$('#startGameBtn').click(function () {
		if (players.length >= MINIMUM_NB_PLAYERS) {
	    	startGame(players.length, 1);
		}
	});

	var phonepad = Phonepad.getInstance();

	phonepad.on('connected', function (gameId) { 
		$('#gameId').html(gameId);
	});

	phonepad.on('padNotSupported', function (padType) { 
		if (padType == Phonepad.PAD_TYPES.gamepad) {
			$('#instructions .col-6:nth-child(1)').css('opacity', 0.3);
		}
	});

	phonepad.on('playerConnected', function (playerId, padType) { 
		addPlayer(padType, playerId);
	});

	phonepad.on('playerDisconnected', function (playerId) { 
		removePlayer(getPlayerIndex(playerId));
	});
	
	phonepad.on('commandsReceived', function (commands) {
		var playerIndex = getPlayerIndex(commands.pId);
		if (game != null) {
	  		players[playerIndex].commands = commands;
		} else {
			if (Math.abs(commands.axes[0]) > 0.3 || commands.buttons[0].pressed || commands.buttons[1].pressed) {
				$('#playersList div:nth(' + playerIndex + ')').addClass('bounce');
			} else {
				$('#playersList div:nth(' + playerIndex + ')').removeClass('bounce');
			}
		}

	});
	
	phonepad.start();
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
	game.start();
}

function restartGame() {
	startGame(game.nbPlayers, game.race.id);
}

function addPlayer(playerType, playerId) {
	if (getPlayerIndex(playerId) == -1) {
		var player = new Player(playerId, playerType);
		players.push(player);
		updatePlayersLayout();
	} else {
		console.log('Player rejoined !');
	}
}

function getPlayerIndex(playerId) {
	for (var i in players) {
		if (players[i].id == playerId) {
			return i;
		}
	}
	return -1;
}

function removePlayer(index) {
	var player = players[index];
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

	game.input.update();
	
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
