var Car = CircleBody.extend({

	init: function (id, image) {
		var mass = 1000;
		var restitution = 0.8;
		var radius = 12;

		this._super(radius, mass, restitution);

		// in game
		this.id = id;
		this.life = PLAYER_START_POINTS;
		this.isOut = false;
		this.outRank = 0;

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
		this.naturalDecceleration = mass * 0.00004;
		this.adherence = 0.11;
	},

	accelerate: function () {
		this.dy = Math.min(this.dy + this.acceleration, this.maxAcceleration);
	},

	brake: function () {
		this.dy = Math.max(0, this.dy - this.brakePower);
	},

	turn: function (isLeft) {
		this.rotation += (isLeft ? -1 : 1) * this.rotationSpeed;
		this.dx += (isLeft ? -1 : 1) * this.glide * this.dy;
		if (Math.abs(this.dx) > this.maxGlide) {
			this.dx = this.dx / Math.abs(this.dx) * this.maxGlide;
		}
	},

	update: function (updatePosition) {
		if (!this.isOut) {
			if (updatePosition) {
				var velocity = this.getVelocityInWorldReference();
				this.x += velocity[0];
				this.y += velocity[1];
			}

			if (this.dy < 0) {
				this.dy = Math.min(0, this.dy + this.naturalDecceleration);
			} else if (this.dy > 0) {
				this.dy = Math.max(0, this.dy - this.naturalDecceleration);
			}

			if (this.dx < 0) {
				this.dx = Math.min(0, this.dx + this.adherence);
			} else if (this.dx > 0) {
				this.dx = Math.max(0, this.dx - this.adherence);
			}
		}
	},

	reset: function () {
		this.isOut = false;
		this.outRank = 0;
		this.rotation = 0;
		this.dx = 0;
		this.dy = 0;
	}

});
