function GamepadHelper () {

	this.callbacks = new GamepadCallbacks();

	this.gamepads = [];

	this.pinging = false;
	this.prevRawGamepadTypes = [];

	var _this = this;

	this.init = function () {
		if ('ongamepadconnected' in window || !!navigator.mozGamepads) {
			// add Firefox events
			window.addEventListener('gamepadconnected', this.onGamepadConnect, false);
			window.addEventListener('gamepaddisconnected', this.onGamepadDisconnect, false);
		} else {
			var gamepadSupportAvailable = navigator.getGamepads || !!navigator.webkitGetGamepads || !!navigator.webkitGamepads;
			if (!gamepadSupportAvailable) {
				this.callbacks.showNotSupported();
			} else {
				// start polling (Google Chrome)
				this.startPolling();
			}
		}
	};

	this.startPolling = function () {
	    if (!this.pinging) {
	    	console.log('GAMEPAD', 'startPolling');
	    	this.pinging = true;
	    	this.pingGamepads();
	    }
	};

	this.stopPolling = function () {
		console.log('GAMEPAD', 'stopPolling');
		this.pinging = false;
	};
	  
	this.pingGamepads = function () {
		_this.pollGamepads();
		_this.scheduleNextPing();
	};

	this.scheduleNextPing = function () {
	    if (this.pinging) {
	    	if (window.requestAnimationFrame) {
	    		window.requestAnimationFrame(this.pingGamepads);
	    	} else if (window.mozRequestAnimationFrame) {
	    		window.mozRequestAnimationFrame(this.pingGamepads);
	    	} else if (window.webkitRequestAnimationFrame) {
	    		window.webkitRequestAnimationFrame(this.pingGamepads);
	    	}
	  	}
	};

  	this.pollGamepads = function () {
	    var rawGamepads = (navigator.getGamepads && navigator.getGamepads()) ||
	    	(navigator.webkitGetGamepads && navigator.webkitGetGamepads());

    	if (rawGamepads) {
				// remove the gamepads that left
				loopPlayer: for (var i in players) {
					var player = players[i];
					if (player.type == GAMEPAD_PLAYER) {
						for (var j in rawGamepads) {
							if (player.extra == rawGamepads[j].id) {
								break loopPlayer;
							}
						}
						delete this.prevRawGamepadTypes[i];
						this.removePlayer(this.gamepads[i]);
					}
				}

				this.gamepads = [];
    		var gamepadsChanged = false;

				for (var i = 0; i < rawGamepads.length; i++) {
					if (rawGamepads[i] != null && rawGamepads[i].id != this.prevRawGamepadTypes[i]) {
						gamepadsChanged = true;
						this.prevRawGamepadTypes[i] = rawGamepads[i].id;
					}

					if (rawGamepads[i]) {
						this.gamepads.push(rawGamepads[i]);
					}
				}

				if (gamepadsChanged) {
					// add new gamepads
					for (var i in this.gamepads) {
						this.addPlayer(this.gamepads[i]);
					}
				}

				this.callbacks.updateGamepads(this.gamepads);
			}
		};

	this.onGamepadConnect = function (event) {
		console.log('GAMEPAD', 'Gamepad connected');

		this.addPlayer(event.gamepad);
		
		this.startPolling();
	};

	this.onGamepadDisconnect = function (event) {
		for (var i in this.gamepads) {
			if (this.gamepads[i].index == event.gamepad.index) {
				console.log('GAMEPAD', 'Gamepad disconnected');
				this.removePlayer(event.gamepad);
				break;
			}
		}

		if (this.gamepads.length == 0) {
			this.stopPolling();
		}
	};

	this.addPlayer = function (newGamepad) {
		newGamepad.playerIndex = players.length;
		for (var i in players) {
			var player = players[i]
			if (player.extra == newGamepad.id) {
				newGamepad.playerIndex = player.id;
				this.gamepads.push(newGamepad);
				return;
			}
		}
		
		addPlayer(GAMEPAD_PLAYER, newGamepad.id);
		this.gamepads.push(newGamepad);
	};

	this.removePlayer = function (gamepad) {
		removePlayer(gamepad.playerIndex);
		this.gamepads.splice(gamepad.index, 1);
	};

};


function GamepadCallbacks () {

	this.showNotSupported = function () {
		$('#tutorials .col-4:nth(0)').css('opacity', 0.2);
	};

 	this.updateGamepads = function (gamepads) {
 		if (gamepads) {
   		for (var i in gamepads) {
 				var gamepad = gamepads[i];
        var playerIndex = gamepad.playerIndex;
	   		if (game == null) {
	   			if (gamepad.buttons[0] instanceof Object && (gamepad.buttons[0].pressed || gamepad.buttons[1].pressed || gamepad.buttons[2].pressed || gamepad.buttons[3].pressed)
	   				|| gamepad.buttons[0] == 1 || gamepad.buttons[1] == 1 || gamepad.buttons[2] == 1 || gamepad.buttons[3] == 1
	   				|| gamepad.axes[0] > 0.2 || gamepad.axes[0] < -0.2) {
	   				$('#playersList div:nth(' + playerIndex + ')').addClass('bounce');
	   			} else if ($('#playersList div:nth(' + playerIndex + ')').hasClass('bounce')) {
	   				$('#playersList div:nth(' + playerIndex + ')').removeClass('bounce');
	   			}
	   		} else if (game.input.inputs[playerIndex] != null) {
	   				if (gamepad.buttons[0] instanceof Object) {
			        game.input.inputs[playerIndex].brake = gamepad.buttons[0].pressed;
			        game.input.inputs[playerIndex].accelerate = gamepad.buttons[1].pressed;
		      	} else {
		      		game.input.inputs[playerIndex].brake = gamepad.buttons[0];
			        game.input.inputs[playerIndex].accelerate = gamepad.buttons[1];
		      	}
		        game.input.inputs[playerIndex].turnLeft = gamepad.axes[0] < -0.2;
		        game.input.inputs[playerIndex].turnRight = gamepad.axes[0] > 0.2;
				}
			}
		}
	};

}
