function PhonePad () {

	this.PHONEPAD_ACCELEROMETER_THRESHOLD = 30.0;
	this.COOKIE_GAME_ID = 'my_machines';
	this.COOKIE_PLAYER_INDEX = 'my_machines_index';
	this.COOKIE_EXPIRATION = 30; // in minutes

	this.gameId = null;
	this.socket = null;
	this.myCommand = null;
	this.isWheel = false;
	this.baseAngle = null;
	this.acceleratePosition = null;
	this.brakePosition = null;
	this.turnLeftPosition = null;
	this.turnRightPosition = null;

	var _this = this;

	this.init = function () {

		// check if any cookie
		this.gameId = getCookie(this.COOKIE_GAME_ID);
		if (this.gameId != null) {
			this.connect(this.gameId, getCookie(this.COOKIE_PLAYER_INDEX));
		}

		// check if accelerometer is enabled
		// if ('deviceorientation' in window || window.DeviceMotionEvent || 'MozOrientation' in window) {
			// $('#wheel').removeClass('hide');
		// }
		
		$('#joinGameDialog button').click(function () {
			var gameId = $('input', '#joinGameDialog').val().toLowerCase();
			if (gameId.length > 0) {
				_this.connect(gameId, null);
			}
			return false;
		});

	};

	this.connect = function (gameId, playerId) {
		try {
			this.socket = io.connect(SERVER_URL);

			// join game
			this.socket.emit('joinGame', { gameId: gameId, playerId: playerId });

			// wait for response
			this.socket.on('gameAccepted', function (playerId) {
				_this.myCommand = new Command(playerId);
				_this.isWheel = $('#wheel input').is(':checked');
				_this.bindEvents();
				_this.gameId = gameId;
				_this.acceleratePosition = $('#accelerateBtn').position();
				_this.brakePosition = $('#brakeBtn').position();
				_this.turnLeftPosition = $('#turnLeftBtn').position();
				_this.turnRightPosition = $('#turnRightBtn').position();
				// set cookies
				setCookie(_this.COOKIE_GAME_ID, gameId, _this.COOKIE_EXPIRATION);
				setCookie(_this.COOKIE_PLAYER_INDEX, playerId, _this.COOKIE_EXPIRATION);

				// update UI
				$('#pad .header div').addClass('player' + playerId % 4);
				$('#joinGameDialog').addClass('hide');
			});

			this.socket.on('gameNotFound', function () {
				_this.gameId = null;
				// delete cookies
				setCookie(_this.COOKIE_GAME_ID, null, -1);
				setCookie(_this.COOKIE_PLAYER_INDEX, null, -1);
			});

			// update player id
			this.socket.on('updatePlayerId', function (newPlayerId) {
				$('#pad .header div').removeClass('player' + _this.myCommand.id).addClass('player' + newPlayerId % 4);
				_this.myCommand = new Command(newPlayerId);
			});

			this.socket.on('disconnect', function () {
				$('#joinGameDialog').removeClass('hide');
				_this.socket = null;
				_this.gameId = null;

			});
		} catch (e) {
		}
	};

	this.dispatchEvent = function (event) {
		event.preventDefault();
		var targetId = event.target.id;
		if (event.type == 'touchmove') {
			var x = event.originalEvent.touches[0].clientX;
			if (event.originalEvent.touches.length > 1) {
				x = Math.min(event.originalEvent.touches[0].clientX, event.originalEvent.touches[1].clientX);
			}
			if (x < _this.acceleratePosition.left 
				&& x > _this.turnRightPosition.left) {
				_this.turnRight();
				return;
			} else if (x < _this.turnRightPosition.left 
				&& x > _this.turnLeftPosition.left) {
				_this.turnLeft();
				return;
			}
		} else if (event.target.tagName == 'IMG') {
			targetId = event.target.parentElement.parentElement.id;
		} else if (event.target.tagName == 'DIV') {
			targetId = event.target.parentElement.id;
		}
		switch(targetId) {
			case 'accelerateBtn':
				_this.accelerate();
				break;
			case 'brakeBtn':
				_this.brake();
				break;
			case 'turnRightBtn':
				_this.turnRight();
				break;
			case 'turnLeftBtn':
				_this.turnLeft();
				break;
		}
	};

	this.dispatchRelease = function (event) {
		var targetId = event.target.id;
		if (event.target.tagName == 'IMG') {
			targetId = event.target.parentElement.parentElement.id;
		} else if (event.target.tagName == 'DIV') {
			targetId = event.target.parentElement.id;
		}
		switch(targetId) {
			case 'accelerateBtn':
				_this.myCommand.accelerate = false;
				_this.release('#' + targetId);
				_this.sendCommands();
				return;
			case 'brakeBtn':
				_this.myCommand.brake = false;
				_this.release('#' + targetId);
				_this.sendCommands();
				return;
			case 'turnRightBtn':
				_this.releaseDirections();
				return;
			case 'turnLeftBtn':
				_this.releaseDirections();
				return;
		}
	};

	this.bindEvents = function () {
		var el = $('.controls');
		el.bind("touchstart", this.dispatchEvent);
		el.bind("touchend", this.dispatchRelease);
		el.bind("touchcancel", this.dispatchRelease);
		el.bind("touchleave", this.dispatchRelease);
		el.bind("touchmove", this.dispatchEvent);

		if (this.isWheel) {
			// add accelerometer events
			if (window.DeviceOrientationEvent) {
			    window.addEventListener("deviceorientation", function () {
			        _this.acceleroTurn(event.alpha);
			    }, true);
			} else if (window.DeviceMotionEvent) {
			    window.addEventListener('devicemotion', function () {
			        _this.acceleroTurn(event.acceleration.z * 2);
			    }, true);
			} else {
			    window.addEventListener("MozOrientation", function () {
			        _this.acceleroTurn(orientation.z * 50);
			    }, true);
			}
		}
	};

	this.acceleroTurn = function (angle) {
		if (angle) {
			if (this.baseAngle == null) {
				this.baseAngle = angle;
			}
			console.log(this.baseAngle - angle)
			if (this.myCommand.turnRight === false && this.baseAngle - angle > this.PHONEPAD_ACCELEROMETER_THRESHOLD) {
				console.log('right')
				this.turnRight();
			} else if (this.myCommand.turnLeft === false && this.baseAngle - angle < - this.PHONEPAD_ACCELEROMETER_THRESHOLD) {
				this.turnLeft();
				console.log('left')
			} else if (this.myCommand.turnRight === true || this.myCommand.turnLeft === true) {
				this.releaseDirections();
				console.log('release')
			}
		}
	};

	this.turnLeft = function () {
		this.myCommand.turnLeft = true;
		this.myCommand.turnRight = false;
		this.press('#turnLeftBtn');
		this.release('#turnRightBtn');
		this.sendCommands();
	};

	this.turnRight = function () {
		this.myCommand.turnLeft = false;
		this.myCommand.turnRight = true;
		this.press('#turnRightBtn');
		this.release('#turnLeftBtn');
		this.sendCommands();
	};

	this.releaseDirections = function () {
		this.myCommand.turnRight = false;
		this.myCommand.turnLeft = false;
		this.release('#turnLeftBtn');
		this.release('#turnRightBtn');
		this.sendCommands();
	};

	this.accelerate = function () {
		this.myCommand.accelerate = true;
		this.myCommand.brake = false;
		this.press('#accelerateBtn');
		this.release('#brakeBtn');
		this.sendCommands();
	};

	this.brake = function () {
		this.myCommand.accelerate = false;
		this.myCommand.brake = true;
		this.press('#brakeBtn');
		this.release('#accelerateBtn');
		this.sendCommands();
	};

	this.press = function (buttonId) {
		$(buttonId).addClass('active');
	};

	this.release = function (buttonId) {
		$(buttonId).removeClass('active');
	};

	this.sendCommands = function () {
		console.log('PHONEPAD', 'sending commands...');
		this.socket.emit('commands', { gameId: this.gameId, commands: this.myCommand });
	};

}
