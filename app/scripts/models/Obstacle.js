// obstactles constants
var OBSTACLES = {
	sugar: {
		image: 'sugar',
		mass: 0,
		size: 80
	},
	macaron: {
		image: 'macaron',
		mass: 900,
		size: 45
	},
	coffee: {
		image: 'coffee',
		mass: 0,
		size: 140
	}
};

var Obstacle = CircleBody.extend({

	restitution: 0.6,
	size : null,
	image : null,
	mass: null,

	init: function (x, y) {
		var randomObstacle = OBSTACLES[Object.keys(OBSTACLES)[Math.floor(Object.keys(OBSTACLES).length * Math.random())]]; 
		this.size = randomObstacle.size;
		this.mass = randomObstacle.mass;

		this._super(this.size / 2, this.mass, this.restitution);

		// graphism
		this.image = document.getElementById(randomObstacle.image);

		// characteristics
		this.naturalDecceleration = randomObstacle.mass * 0.00004;
		this.adherence = 0.11;

		this.x = x;
		this.y = y;
	},

	update: function () {
		if (this.mass > 0) {
			var velocity = this.getVelocityInWorldReference();
			this.x += velocity[0];
			this.y += velocity[1];
			

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

	draw: function () {
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		ctx.drawImage(this.image, - this.size / 2, - this.size / 2, this.size, this.size);
		ctx.rotate(-this.rotation);
		ctx.translate(-this.x, -this.y);
	}
	

});
