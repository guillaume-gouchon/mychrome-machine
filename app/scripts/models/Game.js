function Game(nbPlayers, race) {
	this.nbPlayers = nbPlayers;
	this.race = race;
	this.cars = [];
	this.carsOut = 0;
	this.victory = 8;

	this.GUI = new GUI(this.nbPlayers, this.victory);

	this.isPaused = false;

	this.mapPosition = {
		x: 0,
		y: 0
	};

	// init cars
	for (var i = 0; i < nbPlayers; i++) {
		this.cars.push(new Car(i, race.carImage));
	}

	this.start = function () {

		this.GUI.init();

		var mx = 0, my = 0;
		// init map position
		for (var i = 0; i < this.nbPlayers; i++) {
			var car = this.cars[i];
			mx += car.x;
			my += car.y;
		}

		// center map on cars average positions
		this.mapPosition.x = mx / this.nbPlayers;
		this.mapPosition.y = my / this.nbPlayers;

		animate();
	};

	this.update = function () {
		var mx = 0, my = 0;
		// update car positions
		for (var i = 0; i < this.nbPlayers; i++) {
			var car = this.cars[i];
			car.update();
			if (!car.isOut) {
				mx += car.x;
				my += car.y;
			}
		}

		// center map on cars average positions
		var dx = this.mapPosition.x - mx / this.nbPlayers;
		var dy = this.mapPosition.y - my / this.nbPlayers;

		this.mapPosition.x = mx / this.nbPlayers;
		this.mapPosition.y = my / this.nbPlayers;

		// reposition car depending on the map movement, check if car is out
		for (var i = 0; i < this.nbPlayers; i++) {
			var car = this.cars[i];
			if (!car.isOut) {
				car.x += dx;
				car.y += dy;
				if (car.x < 5 || car.x > screenwidth - 5 || car.y < 5 || car.screenheight > 5) {
					console.log('GAME', 'Car ' + i + ' is out')
					car.isOut = true;
					this.carsOut++;
					car.outRank = this.carsOut;
				}
			}
		}

		if (this.carsOut >= this.nbPlayers - 1 && !this.isPaused) {
			this.endRound();
		}
	};

	this.endRound = function () {
		console.log('GAME', 'end round');
		this.isPaused = true;

		// distribute points, reset cars
		for (var i = 0; i < this.nbPlayers; i++) {
			var car = this.cars[i];
			if (car.isOut) {
				if (car.outRank == 1) {
					car.life = Math.max(0, car.life - 2);
				} else if (car.outRank == 2) {
					car.life -= Math.max(0, car.life - 1);
				} else if (car.outRank >= 3) {
					// points do not change
				}
			} else {
				car.life = Math.min(this.victory, car.life + 2);
			}
		}

		this.GUI.updatePoints(this.cars);

		var victoriousCar = this.checkVictory();
		if (victoriousCar != null) {
			this.GUI.showVictory(victoriousCar);
			endGame(victoriousCar);
		} else {
			var _this = this;
			setTimeout(function () {
				_this.startRound();	
			}, 2000);
		}
	};

	this.startRound = function () {
		console.log('GAME', 'start new round');
		this.carsOut = 0;

		// replace cars
		for (var i = 0; i < this.nbPlayers; i++) {
			var car = this.cars[i];
			car.reset();
			car.x = 50;
			car.y = 50;
		}

		var mx = 0, my = 0;
		// init map position
		for (var i = 0; i < this.nbPlayers; i++) {
			var car = this.cars[i];
			mx += car.x;
			my += car.y;
		}

		// center map on cars average positions
		this.mapPosition.x = mx / this.nbPlayers;
		this.mapPosition.y = my / this.nbPlayers;

		// resume game
		this.isPaused = false;
		animate();
	};

	this.checkVictory = function () {
		for (var i = 0; i < this.nbPlayers; i++) {
			var car = this.cars[i];
			if (car.life == this.victory) {
				// we have a winner
				return car;
			}
		}
		return null;
	}

}