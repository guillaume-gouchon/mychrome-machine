function PhonePad () {

	this.gameId = null;
	this.socket = null;
	this.myCommand = null;
	this.acceleratePosition = null;
	this.brakePosition = null;
	this.turnLeftPosition = null;
	this.turnRightPosition = null;

	var _this = this;
	
	$('#joinGameDialog form').submit(function () {
		var gameId = $('input', '#joinGameDialog').val();
		if (gameId.length > 0) {
			_this.connect(gameId);
		}
		return false;
	});


	this.connect = function (gameId) {
		try {
			this.socket = io.connect(SERVER_URL);

			// join game
			this.socket.emit('joinGame', gameId);

			// wait for response
			this.socket.on('gameAccepted', function (playerId) {
				_this.myCommand = new Command(playerId);
				_this.bindEvents();
				_this.gameId = gameId;
				_this.acceleratePosition = $('#accelerateBtn').position();
				_this.brakePosition = $('#brakeBtn').position();
				_this.turnLeftPosition = $('#turnLeftBtn').position();
				_this.turnRightPosition = $('#turnRightBtn').position();
				requestFullscreen();
				$('#pad .header div').addClass('player' + playerId % 4);
				$('#joinGameDialog').remove();
			});

			// update player id
			this.socket.on('updatePlayerId', function (newPlayerId) {
				$('#pad .header div').removeClass('player' + _this.myCommand.id).addClass('player' + newPlayerId % 4);
				_this.myCommand = new Command(newPlayerId);
			});
		} catch (e) {
			$('#joinGameDialog').removeClass('loading');
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
				_this.myCommand.turnRight = false;
				_this.myCommand.turnLeft = false;
				_this.release('#turnLeftBtn');
				_this.release('#turnRightBtn');
				_this.sendCommands();
				return;
			case 'turnLeftBtn':
				_this.myCommand.turnRight = false;
				_this.myCommand.turnLeft = false;
				_this.release('#turnLeftBtn');
				_this.release('#turnRightBtn');
				_this.sendCommands();
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
