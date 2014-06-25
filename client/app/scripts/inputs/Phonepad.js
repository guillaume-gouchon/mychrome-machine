function PhonePad () {

	this.PHONEPAD_ACCELEROMETER_THRESHOLD = 8.0;
	this.COOKIE_GAME_ID = 'my_machines';
	this.COOKIE_PLAYER_INDEX = 'my_machines_index';
	this.COOKIE_EXPIRATION = 30; // in minutes

	this.gameId = null;
	this.socket = null;
	this.myCommand = new Command();
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
			$('#rejoinBtn').removeClass('hide');
			$('#rejoinBtn').click(function () {
				_this.connect(_this.gameId, getCookie(_this.COOKIE_PLAYER_INDEX));
				return false;
			});
		}

		// check if accelerometer is enabled
		if ('deviceorientation' in window || window.DeviceMotionEvent || 'MozOrientation' in window) {
			$('#wheel').removeClass('hide');
		}

		$('input', '#joinGameDialog').on('focus', function () {
			$(this).removeClass('bounce');
			$('#joinGameBtn').addClass('bounce');
		});
		
		$('#joinGameDialog button').click(function () {
			var gameId = $('input', '#joinGameDialog').val().toLowerCase();
			if (gameId.length > 0) {
				_this.connect(gameId, null);
			}
			return false;
		});

	};

	this.connect = function (gameId, playerId) {
		peer = new Peer(null, {key: PEER_API_KEY});

		// join game
		conn = peer.connect(gameId);
		conn.on('open', function (){
		  conn.send('joinGame', { gameId: gameId, playerId: playerId });

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
		});

			// update player id
			conn.on('updatePlayerId', function (newPlayerId) {
				$('#joinGameDialog').addClass('hide');
				$('#pad .header div').removeClass('player' + _this.myCommand.id).addClass('player' + newPlayerId % 4);
				_this.myCommand = new Command(newPlayerId);
				setCookie(_this.COOKIE_PLAYER_INDEX, newPlayerId, _this.COOKIE_EXPIRATION);
			});

			// this.socket.on('disconnect', function () {
			// 	$('#joinGameDialog').removeClass('hide');
			// 	_this.socket = null;
			// 	_this.gameId = null;

			// });

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
			if (this.isWheel) {
			// add accelerometer events
			if (window.DeviceOrientationEvent) {
			    window.addEventListener('deviceorientation', function () {
			        _this.acceleroTurn(event.alpha);
			    }, true);
			} else if (window.DeviceMotionEvent) {
			    window.addEventListener('devicemotion', function () {
			        _this.acceleroTurn(event.acceleration.z * 2);
			    }, true);
			} else {
			    window.addEventListener('MozOrientation', function () {
			        _this.acceleroTurn(orientation.z * 50);
			    }, true);
			}
			$('#accelerateBtn').bind('touchstart', this.accelerate);
			$('.controls').bind('touchend', function () {
					_this.release('#accelerateBtn');
					_this.myCommand.accelerate = false;
					_this.sendCommands();
			});

			$('.controls').bind('touchcancel', function () {
					_this.release('#accelerateBtn');
					_this.myCommand.accelerate = false;
					_this.sendCommands();
			});
		} else {
			var el = $('.controls');
			el.bind("touchstart", this.dispatchEvent);
			el.bind("touchend", this.dispatchRelease);
			el.bind("touchcancel", this.dispatchRelease);
			el.bind("touchleave", this.dispatchRelease);
			el.bind("touchmove", this.dispatchEvent);
		}
	};

	this.acceleroTurn = function (angle) {
		if (angle) {
			if (this.baseAngle == null) {
				this.baseAngle = angle;
			}
			angle -= this.baseAngle;
			console.log(angle)
			if (this.myCommand.turnRight == false && angle > this.PHONEPAD_ACCELEROMETER_THRESHOLD && angle < 180) {
				console.log('right')
				this.turnRight();
			} else if (this.myCommand.turnLeft == false && (angle < 360 - this.PHONEPAD_ACCELEROMETER_THRESHOLD && angle > 180 || angle < - this.PHONEPAD_ACCELEROMETER_THRESHOLD)) {
				console.log('left')
				this.turnLeft();
			} else if (angle < this.PHONEPAD_ACCELEROMETER_THRESHOLD || angle > 360 - this.PHONEPAD_ACCELEROMETER_THRESHOLD) {
				console.log('release')
				this.releaseDirections();
			}
		}
	};

	this.turnLeft = function () {
		this.myCommand.turnLeft = true;
		this.myCommand.turnRight = false;
		this.sendCommands();

		if (!this.isWheel) {
			this.press('#turnLeftBtn');
			this.release('#turnRightBtn');
		}
	};

	this.turnRight = function () {
		this.myCommand.turnLeft = false;
		this.myCommand.turnRight = true;
		this.sendCommands();

		if (!this.isWheel) {
			this.press('#turnRightBtn');
			this.release('#turnLeftBtn');
		}
	};

	this.releaseDirections = function () {
		this.myCommand.turnRight = false;
		this.myCommand.turnLeft = false;
		this.sendCommands();

		if (!this.isWheel) {
			this.release('#turnLeftBtn');
			this.release('#turnRightBtn');
		}
	};

	this.accelerate = function () {
		_this.press('#accelerateBtn');
		_this.myCommand.accelerate = true;
		_this.myCommand.brake = false;
		_this.sendCommands();

		if (!this.isWheel) {
			_this.release('#brakeBtn');
		}
	};

	this.brake = function () {
		this.myCommand.accelerate = false;
		this.myCommand.brake = true;
		this.sendCommands();

		if (!this.isWheel) {
			this.press('#brakeBtn');
			this.release('#accelerateBtn');
		}
	};

	this.press = function (buttonId) {
		$(buttonId).addClass('active');
	};

	this.release = function (buttonId) {
		$(buttonId).removeClass('active');
	};

	this.sendCommands = function () {
		console.log('PHONEPAD', 'sending commands...');
		conn.send('commands', { gameId: this.gameId, commands: this.myCommand });
	};

}
