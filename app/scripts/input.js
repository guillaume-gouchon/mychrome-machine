var KEY_CODES = {
	A: 65,
	D: 68,
	Left: 37,
	Right: 39
};

var commands = {
	accelerate: false,
	brake: false,
	turnRight: false,
	turnLeft: false
};

window.addEventListener('keyup', function (event) {
	switch(event.keyCode) {
		case KEY_CODES.A:
			commands.accelerate = false;
			break;
		case KEY_CODES.D:
			commands.brake = false;
			break;
		case KEY_CODES.Left:
			commands.turnLeft = false;
			break;
		case KEY_CODES.Right:
			commands.turnRight = false;
			break;
	}
},false);

window.addEventListener('keydown', function (event) {
	switch(event.keyCode) {
		case KEY_CODES.A:
			commands.accelerate = true;
			break;
		case KEY_CODES.D:
			commands.brake = true;
			break;
		case KEY_CODES.Left:
			commands.turnLeft = true;
			break;
		case KEY_CODES.Right:
			commands.turnRight = true;
			break;
	}
},false);

function checkInputs () {
	if (commands.accelerate) {
		game.cars[0].accelerate();
	}
	if (commands.brake) {
		game.cars[0].brake();
	}
	if (commands.turnLeft) {
		game.cars[0].turn(true);
	}
	if (commands.turnRight) {
		game.cars[0].turn(false);
	}
}
