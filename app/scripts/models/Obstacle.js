var Obstacle = CircleBody.extend({

	init: function (id, image, x, y, size) {
		var mass = 0;
		var restitution = 0.8;

		this._super(size, mass, restitution);

		// in game
		this.id = id;

		// graphism
		this.image = IMAGES_PATH + image + '_' + id + '.png';

		// characteristics
		this.naturalDecceleration = mass * 0.00004;
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
	}
	

});
