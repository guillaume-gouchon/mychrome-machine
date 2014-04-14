var ctx, screenwidth, screenheight;
var game = null;

$(function() {

	if (Modernizr.touch && $(window).width() <= 480) {
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

		$('#startGameBtn').click(function () {
		    startGame(4, 1);
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
	game.start();
}

function restartGame() {
	startGame(game.nbPlayers, game.race.id);
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
