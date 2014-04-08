function Game(nbPlayers, race) {
	this.nbPlayers = nbPlayers;
	this.race = race;
	this.cars = [];

	this.mapPosition = {
		x: 0,
		y: 0
	};

	// init cars
	for (var i = 0; i < nbPlayers; i++) {
		this.cars.push(new Car(i, race.carImage));
	}

	this.start = function () {
		animate();
	}

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

		// // center map on cars average positions
		// var dx = this.mapPosition.x - mx / this.nbPlayers;
		// var dy = this.mapPosition.y - my / this.nbPlayers;

		// // reposition car depending on the map movement, check if car is out
		// for (var i = 0; i < this.nbPlayers; i++) {
		// 	var car = this.cars[i];
		// 	car.x -= dx;
		// 	car.y -= dy;
		// 	if (car.x < 5 || car.x > screenwidth - 5 || car.y < 5 || car.screenheight > 5) {
		// 		car.isOut = true;
		// 	}
		// }
	}
}