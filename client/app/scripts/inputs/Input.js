function Input () {

	var KEY_CODES = {
		A: 65,
		D: 68,
		Left: 37,
		Right: 39
	};

	this.init = function () {
		for(var i = 0; i < players.length; i++) {
			var player = players[i];
			player.commands = new Command(player.id);
			
			// add keyboard listener if needed
			if (player.type == KEYBOARD_PLAYER) {
				this.addKeyboardCommandsListener(i);
			}
		}
	};
	
	this.update = function () {
		for (var i = 0; i < players.length; i++) {
			var input = players[i].commands;
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
		var commands = players[playerIndex].commands;
		
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
	};

}
