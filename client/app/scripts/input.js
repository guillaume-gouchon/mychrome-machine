// inputs constants
var KEY_CODES = {
	A: 65,
	D: 68,
	Left: 37,
	Right: 39
};


function Input() {

	this.inputs = [];

	this.init = function (nbPlayers) {
		for(var i = 0; i < nbPlayers; i++) {
			this.inputs.push(new Command(i));
		}

		if (socket != null) {
			var _this = this;
			// init phone pad commands receiver
			socket.on('commands', function (commands) {
				_this.inputs[commands.id] = commands;
			});
		}

		// keyboard
		for (var i in players) {
			var player = players[i];
			if (player.type == KEYBOARD_PLAYER) {
				this.addKeyboardCommandsListener(player.id);
				return;	
			}
		}
	};
	
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

	this.addKeyboardCommandsListener = function (playerIndex) {
		var _this = this;
		window.addEventListener('keyup', function (event) {
			switch(event.keyCode) {
				case KEY_CODES.A:
					_this.inputs[playerIndex].accelerate = false;
					break;
				case KEY_CODES.D:
					_this.inputs[playerIndex].brake = false;
					break;
				case KEY_CODES.Left:
					_this.inputs[playerIndex].turnLeft = false;
					break;
				case KEY_CODES.Right:
					_this.inputs[playerIndex].turnRight = false;
					break;
			}
		},false);

		window.addEventListener('keydown', function (event) {
			switch(event.keyCode) {
				case KEY_CODES.A:
					_this.inputs[playerIndex].accelerate = true;
					break;
				case KEY_CODES.D:
					_this.inputs[playerIndex].brake = true;
					break;
				case KEY_CODES.Left:
					_this.inputs[playerIndex].turnLeft = true;
					break;
				case KEY_CODES.Right:
					_this.inputs[playerIndex].turnRight = true;
					break;
			}
		},false);
	};

}


function Command(id) {
	this.id = id;
	this.accelerate = false;
	this.brake = false;
	this.turnRight = false;
	this.turnLeft = false;
}
