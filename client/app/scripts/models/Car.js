var Car = CircleBody.extend({

	init: function (id, image) {
		var mass = 1000;
		var restitution = 0.8;
		var radius = 14;

		this._super(radius, mass, restitution);

		// in game
		this.id = id;
		this.life = PLAYER_START_POINTS;
		this.isOut = false;
		this.outRank = 0;

		// graphism
		this.image = document.getElementById("car" + id % 4);
		this.smoke = document.getElementById("smoke");
		this.explosion = document.getElementById("explosion");
		this.smokeSprite = 0;
		this.explosionSprite = 0;
		this.width = 45;
		this.height = 27;

		// car characteristics
		this.acceleration = 0.08;
		this.maxAcceleration = 5;
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
	},

	drawSmoke: function () {
		if (!this.isOut && this.dy > 0) {
			this.smokeSprite = this.smokeSprite >= 44 ? 0 : this.smokeSprite + 2;
			ctx.translate(this.x, this.y);
			ctx.rotate(this.rotation);
			var dy = this.dy;
			if (this.dy > 5) {
				dy = 5;
			} else if (this.dy < -5) {
				dy = -5;
			}
			var dx = this.dx;
			if (this.dx > 3) {
				dx = 3;
			} else if (this.dx < -3) {
				dx = -3;
			}
			var sx = parseInt(this.smokeSprite / 15) * 100, sy = 0;
			var sw = 100, sh = 100;
			var dw = this.height / 4 * dy, dh = this.height - 6 + Math.abs(dx) * 3;
			var ddx = -this.width / 3 + Math.abs(dx) * 5 - dw, ddy = -this.height / 2 - dx * 3 + 3;
			ctx.drawImage(this.smoke, sx, sy, sw, sh, ddx, ddy, dw, dh);
			ctx.rotate(-this.rotation);
			ctx.translate(-this.x, -this.y);
		}
	},

	draw: function () {
		if (!this.isOut) {
			ctx.translate(this.x, this.y);
			ctx.rotate(this.rotation);
			ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
			ctx.rotate(-this.rotation);
			ctx.translate(-this.x, -this.y);
		}
	}

});
