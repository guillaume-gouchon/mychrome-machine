// game constants
var PLAYER_START_POINTS = 3;
var NEW_ROUND_PAUSE_DURATION = 2000;
var TRAFFIC_LIGHTS_EACH_DURATION = 700;
var DISTANCE_SCREEN_OUT = 10;
var IMAGES_PATH = '../images/';
var ARROW_SIZE = 60;


function Game(nbPlayers, race) {

	this.nbPlayers = nbPlayers;
	this.race = race;
	this.cars = [];
	this.objects = [];

	this.carsOut = 0;
	this.victory = 8;

	this.GUI = new GUI(this.nbPlayers, this.victory);
	this.input = new Input(this.nbPlayers);
	this.physics = new Physics(this);

	// game states
	this.isPaused = false;
	this.isAccelerationPhase = false;

	this.distance = 0;
	this.displacement = [0, 0];

	// table
	this.tablePosition = [0, 0];
	this.table = document.getElementById("table");

	// arrow
	this.arrow = document.getElementById("arrow");
	this.whereToGo = Math.random() * 360;


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
		this.input.init(this.nbPlayers);
		this.GUI.init();
		this.startRound();
	};

	this.update = function () {

		if (this.distance > 2000 + Math.random() * 1000) {
			this.distance = 0;
			for (var i = 0; i < Math.random() * 6; i++) {
				this.popNewObstacle();
			}
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
			this.displacement = [dx, dy];

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
							console.log('GAME', 'car ' + obj.id + ' is out');
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
		var translationBetweenCars = getTranslationDiff(40, degToRad(this.whereToGo) - Math.PI / 2);
		var translationBetweenCarsRows = getTranslationDiff(70, degToRad(this.whereToGo) + Math.PI);

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
			// reset cars
			car.reset();
			car.x = screenwidth / 2 + translationBetweenCars[0] * (i % 4 - (this.nbPlayers % 4) / 2) + Math.floor(i / 4) * translationBetweenCarsRows[0];
			car.y = screenheight / 2 + translationBetweenCars[1] * (i % 4 - (this.nbPlayers % 4) / 2) + Math.floor(i / 4) * translationBetweenCarsRows[1];
			car.rotation = degToRad(this.whereToGo);
		}

		// start acceleration phase and show traffic light
		this.isPaused = false;
		this.isAccelerationPhase = true;
		tablePosition = [0, 0];
		this.displacement = [0, 0];
		animate();
		var _this = this;
		this.GUI.showTrafficLights(function () {
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
		});		
	};

	this.endRound = function () {
		console.log('GAME', 'end round');

		// pause game
		this.isPaused = true;

		// update points, show winner car
		this.distributePoints();		

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

	this.distributePoints = function () {
		for (var i = 0; i < this.nbPlayers; i++) {
			var car = this.cars[i];
			var leaderCar = this.cars[i % 4];// when more than 4 players, there are teams
			if (car.isOut) {
				if (car.outRank == 1) {
					leaderCar.life = Math.max(0, leaderCar.life - 2);
				} else if (car.outRank == 2) {
					leaderCar.life = Math.max(0, leaderCar.life - 1);
				} else if (car.outRank == this.nbPlayers  - 1) {
					leaderCar.life = Math.max(0, leaderCar.life + 1);
				} else {
					// points do not change
				}
			} else {
				leaderCar.life = Math.min(this.victory, leaderCar.life + 2);

				// show winner car
				this.GUI.showWinnerCar(car);
			}
		}
	};

	this.checkVictory = function () {
		var winner = null;
		for (var i = 0; i < this.nbPlayers; i++) {
			var car = this.cars[i];
			if (car.life == this.victory) {
				if (winner != null) {
					// the winner is the winner of the round
					winner = winner.isOut ? car : winner;
				} else {
					winner = car;
				}
			}
		}
		return winner;
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
		var obstacle = new Obstacle(0, null, x, y, 10 + 30 * Math.random());
		this.objects.push(obstacle);
	};

	this.rotateRoad = function () {
		this.whereToGo += Math.random() * 20;
		this.whereToGo %= 360;
	};


	this.draw = function () {

		// draw table
		this.tablePosition[0] -= this.displacement[0] * 0.07;
		this.tablePosition[1] -= this.displacement[1] * 0.07;
		if (Math.abs(this.tablePosition[0]) >= 100) {
			this.tablePosition[0] = 0;
		}
		if (Math.abs(this.tablePosition[1]) >= 120) {
			this.tablePosition[1] = 0;
		}
		ctx.drawImage(this.table, 0, 0, screenwidth, screenheight, this.tablePosition[0] - 100, this.tablePosition[1] - 120, screenwidth + 200, screenheight + 240);

		// draw arrow
		var arrowPosition = getTranslationDiff(120, degToRad(this.whereToGo));
		var x = Math.max(10, Math.min(screenwidth - 10, arrowPosition[0] + screenwidth / 2 - ARROW_SIZE / 2));
		var y = Math.max(10, Math.min(screenheight - 10, arrowPosition[1] + screenheight / 2 - ARROW_SIZE / 2));
		ctx.translate(x, y);
		ctx.rotate(degToRad(this.whereToGo));
		ctx.drawImage(arrow, -ARROW_SIZE / 2, -ARROW_SIZE / 2, ARROW_SIZE, ARROW_SIZE);
		ctx.rotate(-degToRad(this.whereToGo));
		ctx.translate(-x, -y);

		// draw car smokes
		for (var i = 0; i < this.cars.length; i++) {
			var car = this.cars[i];
			car.drawSmoke();
		}

		// draw objects (= cars + obstacles)
		for (var i = 0; i < this.objects.length; i++) {
			var obj = this.objects[i];
			obj.draw();
		}

	};

}
