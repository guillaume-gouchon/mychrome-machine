function GUI (nbPlayers, victory) {

	this.nbPlayers = nbPlayers;
	this.victory = victory;

	this.init = function () {
		console.log('GUI', 'init');
		for (var i = 0; i < this.nbPlayers; i++) {
			var s = '';
			for (var n = 0; n < this.victory; n++) {
				s += '<div class="point ' + (n >= this.victory - PLAYER_START_POINTS ? 'active' : '') + '">&nbsp;</div>';
			}
			$('.playerPoints:nth(' + i + ')').html(s);
		}
	};

	this.showVictory = function (car) {
		console.log('GUI', 'showVictory');
		this.showLabel('<div>Player ' + (car.id + 1) + ' has won !</div><button class="btn" onClick="startGame()">Replay ?</button>', false);
	};

	this.updatePoints = function (cars) {
		console.log('GUI', 'updatePoints');
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
		}, NEW_ROUND_PAUSE_DURATION);
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

	this.showTrafficLights = function (callback) {
		console.log('GUI', 'showTrafficLights');
		$('#trafficLights div div').removeClass('green');
		$('#trafficLights').removeClass('fadeOut').addClass('show');
		var nbLightOn = -1;
		var trafficLightingOn = setInterval(function () {
			if (nbLightOn >= 0) {// wait first
				// enlight traffic light
				$('#trafficLights div div:nth(' + nbLightOn + ')').addClass('green');
				if (nbLightOn >= 2) {
					// all lights are on, start !
					$('#trafficLights').removeClass('show').addClass('fadeOut');
					clearInterval(trafficLightingOn);
					callback();
				}
			}
			nbLightOn++;
		}, TRAFFIC_LIGHTS_EACH_DURATION);
	}

}