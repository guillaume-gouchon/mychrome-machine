function Input(nbPlayers) {

	this.inputs = [];
	for(var i = 0; i < nbPlayers; i++) {
		this.inputs.push(new Command(i));
	}

	socket.on('commands', function (commands) {
		this.inputs[commands.id] = commands;
	});

	this.checkInputs = function () {
		for (var i = 0; i < this.inputs.length; i++) {
			var input = this.inputs[i];
			if (input.accelerate) {
				game.cars[i].accelerate();
			}
			if (input.brake) {
				game.cars[i].brake();
			}
			if (input.turnLeft) {
				game.cars[i].turn(true);
			}
			if (input.turnRight) {
				game.cars[i].turn(false);
			}
		}
	};
	
	// TODO remove
	var _this = this;
	window.addEventListener('keyup', function (event) {
		switch(event.keyCode) {
			case KEY_CODES.A:
				_this.inputs[0].accelerate = false;
				break;
			case KEY_CODES.D:
				_this.inputs[0].brake = false;
				break;
			case KEY_CODES.Left:
				_this.inputs[0].turnLeft = false;
				break;
			case KEY_CODES.Right:
				_this.inputs[0].turnRight = false;
				break;
		}
	},false);

	window.addEventListener('keydown', function (event) {
		switch(event.keyCode) {
			case KEY_CODES.A:
				_this.inputs[0].accelerate = true;
				break;
			case KEY_CODES.D:
				_this.inputs[0].brake = true;
				break;
			case KEY_CODES.Left:
				_this.inputs[0].turnLeft = true;
				break;
			case KEY_CODES.Right:
				_this.inputs[0].turnRight = true;
				break;
		}
	},false);

}


	// TODO remove
	var KEY_CODES = {
		A: 65,
		D: 68,
		Left: 37,
		Right: 39
	};


function Command(id) {
	this.id = id;
	this.accelerate = false;
	this.brake = false;
	this.turnRight = false;
	this.turnLeft = false;
}
