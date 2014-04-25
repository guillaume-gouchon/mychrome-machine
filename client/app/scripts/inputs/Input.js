function Input () {

	this.KEY_CODES = {
		A: 65,
		D: 68,
		Left: 37,
		Right: 39
	};

	this.inputs = [];

	this.init = function () {
		for(var i = 0; i < game.nbPlayers; i++) {
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
	
	this.update = function () {
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
				case _this.KEY_CODES.A:
					_this.inputs[playerIndex].accelerate = false;
					break;
				case _this.KEY_CODES.D:
					_this.inputs[playerIndex].brake = false;
					break;
				case _this.KEY_CODES.Left:
					_this.inputs[playerIndex].turnLeft = false;
					break;
				case _this.KEY_CODES.Right:
					_this.inputs[playerIndex].turnRight = false;
					break;
			}
		},false);

		window.addEventListener('keydown', function (event) {
			switch(event.keyCode) {
				case _this.KEY_CODES.A:
					_this.inputs[playerIndex].accelerate = true;
					break;
				case _this.KEY_CODES.D:
					_this.inputs[playerIndex].brake = true;
					break;
				case _this.KEY_CODES.Left:
					_this.inputs[playerIndex].turnLeft = true;
					break;
				case _this.KEY_CODES.Right:
					_this.inputs[playerIndex].turnRight = true;
					break;
			}
		},false);
	};

}
