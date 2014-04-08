function GUI (nbPlayers, victory) {

	this.nbPlayers = nbPlayers;
	this.victory = victory;

	this.init = function () {
		for (var i = 0; i < this.nbPlayers; i++) {
			var s = '';
			for (var n = 0; n < this.victory; n++) {
				s += '<div class="point ' + (n >= this.victory - 3 ? 'active' : '') + '">&nbsp;</div>';
			}
			$('.playerPoints:nth(' + i + ')').html(s);
		}
		this.showLabel('GO !', true)
	};

	this.showVictory = function (car) {
		this.showLabel('<div>Player ' + (car.id + 1) + ' has won !</div><button class="btn" onClick="startGame()">Replay ?</button>', false);
	};

	this.updatePoints = function (cars) {
		for (var i = 0; i < this.nbPlayers; i++) {
			var car = cars[i];
			for (var n = 0; n < this.victory; n++) {
				var element = $('.playerPoints:nth(' + i + ') .point:nth(' + n + ')');
				if (n >= this.victory - car.life && !element.hasClass('active')) {
					element.addClass('active new');
				} else if (n < this.victory - car.life && element.hasClass('active')) {
					element.removeClass('active');
					element.outerWidth();// trick to stop the CSS animation and start another one
					element.addClass('new');
				}
			}
		}

		setTimeout(function () {
			$('.playerPoints .point.new').removeClass('new').outerWidth();
		}, 1500);
	};

	this.showLabel = function (text, isLeaving) {
		console.log('GUI', 'showLabel', text);
		var bigMessage = $('#bigMessage');
		bigMessage.html(text);
		if (isLeaving) {
			bigMessage.addClass('showLeave');
		} else {
			bigMessage.addClass('show');
		}
	};

}