

function GUI (nbPlayers, victory) {

	this.nbPlayers = nbPlayers;
	this.victory = victory;

	this.init = function () {
		for (var i = 0; i < this.nbPlayers; i++) {
			var s = '';
			for (var n = 0; n < this.victory; n++) {
				s += '<div class="point ' + (n >= this.victory - 3 ? 'active' : '') + '">&nbsp;</div>';
			}
			$('.playerPoints:nth(' + i + ')').append(s);
		}

		this.showLabel('GO !')
	};

	this.showVictory = function (car) {
		this.showLabel('<div>Player ' + (car.id + 1) + ' has won !</div><button id="btnReplay" class="btn">Replay ?</button>', false);
	};

	this.updatePoints = function (cars) {
		$('.playerPoints .point').removeClass('active');
		for (var i = 0; i < this.nbPlayers; i++) {
			var car = cars[i];
			for (var n = 0; n < this.victory; n++) {
				if (n >= this.victory - car.life) {
					$('.playerPoints:nth(' + i + ') .point:nth(' + n + ')').addClass('active');
				}
			}
		}
	};

	this.showLabel = function (text, isLeaving) {
		var bigMessage = $('#bigMessage');
		bigMessage.html(text);
		if (isLeaving) {
			bigMessage.addClass('showLeave');
		} else {
			bigMessage.addClass('show');
		}
	};

}