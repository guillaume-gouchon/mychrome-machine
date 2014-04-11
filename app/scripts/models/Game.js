function Game(nbPlayers, race) {
	this.nbPlayers = nbPlayers;
	this.race = race;
	this.cars = [];
	this.objects = [];

	this.carsOut = 0;
	this.victory = 8;

	this.GUI = new GUI(this.nbPlayers, this.victory);
	this.physics = new Physics(this);

	this.isPaused = false;
	this.isAccelerationPhase = false;

	this.whereToGo = Math.random() * 360;
	this.distance = 0;

	// add cars
	for (var i = 0; i < nbPlayers; i++) {
		var car = new Car(i, race.carImage);
		this.cars.push(car);
		this.objects.push(car);
	}

	// add obstacles
	for (var i = 0; i < Math.random() * 3; i++) {
		var obstaclePosition = getTranslationDiff(screenwidth, this.whereToGo);
		var obstacle = new Obstacle(0, null, obstaclePosition[0] + screenwidth / 2, obstaclePosition[1] + screenheight / 2, 20 + 20 * Math.random());
		this.objects.push(obstacle);
	}

	this.start = function () {
		this.GUI.init();
		this.startRound();
	};

	this.update = function () {

		if (this.distance > 2000 + Math.random() * 1000) {
			this.distance = 0;
			this.popNewObstacle();
			this.rotateRoad();
		}

		var mx = 0, my = 0;
		// update objects positions
		for (var i = 0; i < this.objects.length; i++) {
			var obj = this.objects[i];
			obj.update(!game.isAccelerationPhase);
		}

		if (!game.isAccelerationPhase) {
			// resolve collisions
			this.physics.update();

			// find first car
			var firstCar = this.getFirstCar();

			// center map on first car
			var dx = firstCar.x - screenwidth / 2;
			var dy = firstCar.y - screenheight / 2;

			this.distance += Math.pow(dx * dx + dy * dy, 0.5);

			// reposition objects depending on the map movement, check if object is out
			var oLength = this.objects.length;
			while (oLength --) {
				var obj = this.objects[oLength];
				if (!obj.isOut) {
					obj.x -= dx * 0.07;
					obj.y -= dy * 0.07;
					if (obj.x < - DISTANCE_SCREEN_OUT || obj.x > screenwidth + DISTANCE_SCREEN_OUT || obj.y < -DISTANCE_SCREEN_OUT || obj.y > screenheight + DISTANCE_SCREEN_OUT) {
						if (obj instanceof Obstacle) {
							this.objects.splice(oLength, 1);
						} else if (obj instanceof Car) {
							console.log('GAME', 'car ' + i + ' is out');
							obj.isOut = true;
							this.carsOut++;
							obj.outRank = this.carsOut;
						}
					}
				}
			}

			if (this.carsOut >= this.nbPlayers - 1 && !this.isPaused) {
				this.carsOut = 0;
				this.endRound();
			}
		}
	};

	this.startRound = function () {
		console.log('GAME', 'start new round');

		// hide winner car
		this.GUI.hideWinnerCar(car);

		// reposition cars
		var translationBetweenCars = getTranslationDiff(30, degToRad(this.whereToGo) - Math.PI / 2);
		// shuffle car order
		var shuffleArray = [];
		for (var i = 0; i < this.nbPlayers; i++) {
			shuffleArray.push(i);
		}
		for (var i = 0; i < this.nbPlayers; i++) {
			// get random index
			var randomIndex = Math.floor(Math.random() * shuffleArray.length);
			var car = this.cars[shuffleArray[randomIndex]];
			shuffleArray.splice(randomIndex, 1);
			car.reset();
			car.x = screenwidth / 2 + translationBetweenCars[0] * (i - this.nbPlayers / 2);
			car.y = screenheight / 2 + translationBetweenCars[1] * (i - this.nbPlayers / 2);
			car.rotation = degToRad(this.whereToGo);
		}

		// start acceleration phase and show traffic light
		this.isPaused = false;
		this.isAccelerationPhase = true;
		animate();
		var _this = this;
		// this.GUI.showTrafficLights(function () {
			// go !!!
			console.log('GAME', 'GO !');
			_this.isAccelerationPhase = false;

			// not good to accelerate too much at start
			for (var i = 0; i < _this.nbPlayers; i++) {
				var car = _this.cars[i];
				if (car.dy > car.maxAcceleration / 3) {
					car.dy = 0;
				}
			}
		// });		
	};

	this.endRound = function () {
		console.log('GAME', 'end round');

		// pause game
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

				// show winner car
				this.GUI.showWinnerCar(car);
			}
		}

		// update players points
		this.GUI.updatePoints(this.cars);

		// check victory
		var victoriousCar = this.checkVictory();
		if (victoriousCar != null) {
			// one player has won
			this.GUI.showVictory(victoriousCar);
		} else {
			// restart another round
			var _this = this;
			setTimeout(function () {
				_this.startRound();	
			}, NEW_ROUND_PAUSE_DURATION);
		}
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
	};

	this.getFirstCar = function () {
		var minDistance;
		var firstCar = null;
		var arrowPosition = getTranslationDiff(500, degToRad(this.whereToGo));
		for (var i = 0; i < this.nbPlayers; i++) {
			var car = this.cars[i];
			if (!car.isOut) {
				var distance = getDistanceBetween(car.x, car.y, screenwidth / 2 + arrowPosition[0], screenheight / 2 + arrowPosition[1]);
				if (firstCar == null || distance < minDistance) {
					minDistance = distance;
					firstCar = car;
				}
			}
		}
		return firstCar;
	};

	this.popNewObstacle = function () {
		// pop random obstacle
		var randomAngle = degToRad(this.whereToGo) + Math.PI / 2 * (Math.random() - 0.5);
		randomAngle %= 2 * Math.PI;
		var obstaclePosition = getTranslationDiff(screenwidth, randomAngle);
		var x = Math.max(10, Math.min(screenwidth - 10, obstaclePosition[0]));
		var y = Math.max(10, Math.min(screenheight - 10, obstaclePosition[1]));
		var obstacle = new Obstacle(0, null, x, y, 10 + 10 * Math.random());
		this.objects.push(obstacle);
	};

	this.rotateRoad = function () {
		this.whereToGo += Math.random() * 20;
		this.whereToGo %= 360;
	};

}
