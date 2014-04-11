
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

var DISTANCE_SCREEN_OUT = 10;

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

var img = document.getElementById("arrow");

function drawGame() {

	// draw pattern for table


	// draw direction
	var arrowPosition = getTranslationDiff(50, degToRad(game.whereToGo));
	var x = Math.max(10, Math.min(screenwidth - 10, arrowPosition[0] + screenwidth / 2));
	var y = Math.max(10, Math.min(screenheight - 10, arrowPosition[1] + screenheight / 2));
	ctx.translate(x, y);
	ctx.rotate(degToRad(game.whereToGo));
	ctx.drawImage(img, -30, -30);
	ctx.rotate(-degToRad(game.whereToGo));
	ctx.translate(-x, -y);

	// draw objects
	for (var i = 0; i < game.objects.length; i++) {
		var obj = game.objects[i];
		if (obj instanceof Obstacle) {
			ctx.translate(obj.x - obj.radius / 2, obj.y - obj.radius /2);
			ctx.rotate(obj.rotation);
			ctx.fillStyle = '#fff';
			ctx.beginPath();
			ctx.arc(- obj.radius /2, - obj.radius/2, obj.radius, 0, Math.PI*2, true); 
			ctx.closePath();
			ctx.fill();
			ctx.rotate(-obj.rotation);
			ctx.translate(-obj.x + obj.radius/2, -obj.y + obj.radius/2);
		} else if (obj instanceof Car) {
			if (!obj.isOut) {
				ctx.translate(obj.x - 35/2, obj.y - 20/2);
				ctx.rotate(obj.rotation);
				ctx.fillStyle = '#aaa';
				ctx.fillRect(- 35/2 + Math.abs(obj.dx) * 3, - 20/2 + obj.dx * 3, -obj.dy * 3, 20)
				ctx.fillStyle = obj.color;
				ctx.fillRect(- 35/2, - 20/2, 35, 20);
				ctx.rotate(-obj.rotation);
				ctx.translate(-obj.x + 35/2, -obj.y + 20/2);
			}
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

function getTranslationDiff(distance, angle) {
    if (angle > 0  && angle < Math.PI) {
        return [distance * Math.cos(angle), distance * Math.sin(angle)];
    } else {
        return [- distance * Math.cos(angle), distance * Math.sin(angle + Math.PI)];
    }
}

