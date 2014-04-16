function PhonePad () {

	this.gameId = null;
	this.socket = null;
	
	var _this = this;

	$('#joinGameBtn').click(function () {
		var gameId = $('input', '#joinGameDialog').val();
		if (gameId.length > 0) {
			_this.connect(gameId);
			$('#joinGameDialog').addClass('loading');
		}
	});

	this.connect = function (gameId) {
		try {
			this.socket = io.connect('http://localhost:1234');

			// join game
			this.socket.emit('joinGame', gameId);

			// wait for response
			this.socket.on('gameAccepted', function (playerId) {
				_this.myCommand = new Command(playerId);
				_this.bindEvents();
				_this.gameId = gameId;
				$('#pad .header div').addClass('player' + playerId % 4);
				$('#joinGameDialog').remove();
			});

		} catch (e) {
			console.log(e);
			$('#joinGameDialog').removeClass('loading');
		}
	};

	this.bindEvents = function () {
		document.getElementById('pad').onmousedown = this.dispatchEvent;
		document.getElementById('pad').ontouchmove = this.dispatchEvent;
		document.getElementById('pad').onmouseup = this.dispatchRelease;
	};

	this.dispatchEvent = function (event) {
		var targetId = event.target.id;
		console.log(event)
		if (event.target.tagName == 'IMG') {
			targetId = event.target.parentElement.id;
		}
		switch(targetId) {
			case 'accelerateBtn':
				_this.accelerate(targetId);
				break;
			case 'brakeBtn':
				_this.brake(targetId);
				break;
			case 'turnRightBtn':
				_this.turnRight(targetId);
				break;
			case 'turnLeftBtn':
				_this.turnLeft(targetId);
				break;
		}
	};

	this.dispatchRelease = function (event) {
		var targetId = event.target.id;
		if (event.target.tagName == 'IMG') {
			targetId = event.target.parentElement.id;
		}
		switch(targetId) {
			case 'accelerateBtn':
				_this.myCommand.accelerate = false;
				_this.release('#' + targetId);
				_this.sendCommands();
				break;
			case 'brakeBtn':
				_this.myCommand.brake = false;
				_this.release('#' + targetId);
				_this.sendCommands();
				break;
			case 'turnRightBtn':
				_this.myCommand.turnRight = false;
				_this.release('#' + targetId);
				_this.sendCommands();
				break;
			case 'turnLeftBtn':
				_this.myCommand.turnLeft = false;
				_this.release('#' + targetId);
				_this.sendCommands();
				break;
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
		this.socket.emit('commands', { gameId: this.gameId, commands: this.myCommand });
	};

}
