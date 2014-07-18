function Input () {

	var AXES_THRESHOLD = 0.3;

	this.update = function () {
		for (var i = 0; i < players.length; i++) {
			var commands = players[i].commands;
			if (commands != null) {
				var playerCar = game.cars[i];
				if (commands.buttons[0].pressed) {
					playerCar.accelerate();
				}
				if (commands.buttons[1].pressed) {
					playerCar.brake();
				}
				if (commands.axes[0] < -AXES_THRESHOLD) {
					playerCar.turn(true);
				}
				if (commands.axes[0] > AXES_THRESHOLD) {
					playerCar.turn(false);
				}
			}
		}
	};

}
