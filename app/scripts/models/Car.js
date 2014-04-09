function Car(id, image) {
	// in game
	this.id = id;
	this.life = PLAYER_START_POINTS;
	this.isOut = false;
	this.outRank = 0;
	this.x = 50 + id * 60;
	this.y = 50;
	this.rotation = 0;
	this.dx = 0;// force centrifuge (centripete ?)
	this.dy = 0;// force moteur

	// graphism
	this.image = IMAGES_PATH + image + '_' + id + '.png';
	this.color = PLAYER_COLORS[id];

	// car characteristics
	this.acceleration = 0.08;
	this.maxAcceleration = 4;
	this.brakePower = 0.16;
	this.rotationSpeed = 0.05;
	this.glide = 0.1;
	this.maxGlide = 1.6;
	this.naturalDecceleration = 0.03;
	this.adherence = 0.11;

	this.accelerate = function () {
		this.dy = Math.min(this.dy + this.acceleration, this.maxAcceleration);
	};

	this.brake = function () {
		this.dy = Math.max(0, this.dy - this.brakePower);
	};

	this.turn = function (isLeft) {
		this.rotation += (isLeft ? -1 : 1) * this.rotationSpeed;
		this.dx += (isLeft ? -1 : 1) * this.glide * this.dy;
		if (Math.abs(this.dx) > this.maxGlide) {
			this.dx = this.dx / Math.abs(this.dx) * this.maxGlide;
		}
	};

	this.update = function (updatePosition) {
		if (!this.isOut) {
			if (updatePosition) {
				this.x += this.dy * Math.cos(this.rotation) + this.dx * Math.cos(this.rotation - Math.PI / 2);
				this.y += this.dy * Math.sin(this.rotation) + this.dx * Math.sin(this.rotation - Math.PI / 2);
			}

			if (this.dy > 0) {
				this.dy = Math.max(0, this.dy - this.naturalDecceleration);
			}

			if (this.dx < 0) {
				this.dx = Math.min(0, this.dx + this.adherence);
			} else if (this.dx > 0) {
				this.dx = Math.max(0, this.dx - this.adherence);
			}
		}
	};

	this.reset = function () {
		this.isOut = false;
		this.outRank = 0;
		this.rotation = 0;
		this.dx = 0;
		this.dy = 0;
	};
}