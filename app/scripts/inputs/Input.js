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
		}
	};
	
	this.update = function () {
		for (var i = 0; i < players.length; i++) {
			var input = players[i].commands;
			if (input.buttons[0].pressed) {
				game.cars[i].accelerate();
			}
			if (input.buttons[1].pressed.brake) {
				game.cars[i].brake();
			}
			if (input.axes[0] < -0.3) {
				game.cars[i].turn(true);
			}
			if (input.axes[0] > 0.3) {
				game.cars[i].turn(false);
			}
		}
	};

}
