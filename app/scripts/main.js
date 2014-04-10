
window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
	  window.setTimeout(callback, 1000 / 10);
	};
})();



var carCanvas = document.getElementById("cars");
var ctx = carCanvas.getContext("2d");

var screenwidth = carCanvas.width, screenheight = carCanvas.height;


var PLAYER_COLORS = ['#0000ff', '#ff0000', '#ffff00', '#00ff00'];
var PLAYER_START_POINTS = 3;
var NEW_ROUND_PAUSE_DURATION = 2000;
var TRAFFIC_LIGHTS_EACH_DURATION = 700;

var IMAGES_PATH = '../images/';

function animate() {

	checkInputs();
	
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

function drawGame() {
	// draw direction
	ctx.strokeStyle = '#fff';
	ctx.beginPath();
	ctx.moveTo(screenwidth/2,screenheight/2);
	ctx.lineTo(screenwidth / 2 + screenheight / 2 / Math.tan(degToRad(game.whereToGo)),screenheight);
	ctx.stroke();

	// draw cars
	for (var i = 0; i < game.nbPlayers; i++) {
		var car = game.cars[i];
		if (!car.isOut) {
			ctx.translate(car.x - 35/2, car.y - 20/2);
			ctx.rotate(car.rotation);
			ctx.fillStyle = '#aaa';
			ctx.fillRect(- 35/2 + Math.abs(car.dx) * 3, - 20/2 + car.dx * 3, -car.dy * 3, 20)
			ctx.fillStyle = car.color;
			ctx.fillRect(- 35/2, - 20/2, 35, 20);
			ctx.rotate(-car.rotation);
			ctx.translate(-car.x + 35/2, -car.y + 20/2);
		}
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

function getAngleCar(deg, x, y) {
	var angle = Math.PI / 2 - degToRad(deg) - Math.asin(x / (x * x + y * y));
	// console.log(180 * angle / Math.PI);
	return angle;
}

function getTranslationDiff(distance, angle) {
    if (angle > 0  && angle < Math.PI) {
        return [distance * Math.cos(angle), distance * Math.sin(angle)];
    } else {
        return [- distance * Math.cos(angle), distance * Math.sin(angle + Math.PI)];
    }
}

