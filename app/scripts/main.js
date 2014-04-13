
window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
	  window.setTimeout(callback, 1000 / 10);
	};
})();



var carCanvas = document.getElementById("cars");
carCanvas.width = 800;
carCanvas.height = 500;

var ctx = carCanvas.getContext("2d");

var screenwidth = 800, screenheight = 500;


var PLAYER_START_POINTS = 3;
var NEW_ROUND_PAUSE_DURATION = 2000;
var TRAFFIC_LIGHTS_EACH_DURATION = 700;

var DISTANCE_SCREEN_OUT = 10;

var IMAGES_PATH = '../images/';

var ARROW_SIZE = 60;

function animate() {

	game.input.checkInputs();
	
	game.update();

	clearCanvas();

	drawGame();

	if (!game.isPaused) {
		// request new frame
		requestAnimFrame(function () {
		  animate();
		});
	}

}

function clearCanvas() {
	var minX = carCanvas.width, minY = carCanvas.height, maxX = 0, maxY = 0;
	// for (var i = 0; i < game.nbPlayers; i++) {
	// 	var car = game.cars[i];
	// 	if (!car.isOut) {
	// 		if (car.x <= minX) {
	// 			minX = Math.max(0, car.x - 30);
	// 		}
	// 		if (car.x >= maxX) {
	// 			maxX = car.x + 30;
	// 		}
	// 		if (car.y <= minY) {
	// 			minY =  Math.max(0, car.y - 30);
	// 		}
	// 		if (car.y >= maxY) {
	// 			maxY = car.y + 30;
	// 		}
	// 	}
	// }

	ctx.clearRect(minX, minY, maxX - minX, maxY - minY);
}

var table = document.getElementById("table");
var arrow = document.getElementById("arrow");

var tablePosition = [0, 0];

function drawGame() {

	// draw pattern for table
	var pat = ctx.createPattern(table,"repeat");
	tablePosition[0] -= game.displacement[0] * 0.07;
	tablePosition[1] -= game.displacement[1] * 0.07;
	if (Math.abs(tablePosition[0]) >= 100) {
		tablePosition[0] = 0;
	}
	if (Math.abs(tablePosition[1]) >= 120) {
		tablePosition[1] = 0;
	}
	ctx.drawImage(table, 0, 0, screenwidth, screenheight, tablePosition[0] - 100, tablePosition[1] - 120, screenwidth + 200, screenheight + 240);

	// draw arrow
	var arrowPosition = getTranslationDiff(120, degToRad(game.whereToGo));
	var x = Math.max(10, Math.min(screenwidth - 10, arrowPosition[0] + screenwidth / 2));
	var y = Math.max(10, Math.min(screenheight - 10, arrowPosition[1] + screenheight / 2));
	ctx.translate(x, y);
	ctx.rotate(degToRad(game.whereToGo));
	ctx.drawImage(arrow, -ARROW_SIZE / 2, -ARROW_SIZE / 2, ARROW_SIZE, ARROW_SIZE);
	ctx.rotate(-degToRad(game.whereToGo));
	ctx.translate(-x, -y);

	// draw smoke
	for (var i = 0; i < game.cars.length; i++) {
		var car = game.cars[i];
		car.drawSmoke();
	}

	// draw objects
	for (var i = 0; i < game.objects.length; i++) {
		var obj = game.objects[i];
		obj.draw();
	}
}


var game = null;

function startGame(nbPlayers, raceId) {
	$('#bigMessage').removeClass('show');
	game = new Game(nbPlayers, new Race(raceId, 'car'));
	game.start();	
}

function restartGame() {
	startGame(game.nbPlayers, game.race.id);
}


startGame(4, 1);





/**
*	Utils
*/
function degToRad(deg) {
	return deg * Math.PI / 180;
}

function getTranslationDiff(distance, angle) {
    if (angle > 0  && angle < Math.PI) {
        return [distance * Math.cos(angle), distance * Math.sin(angle)];
    } else {
        return [distance * Math.cos(angle), - distance * Math.sin(angle + Math.PI)];
    }
}

