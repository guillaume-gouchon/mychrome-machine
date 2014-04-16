var RigidBody = Class.extend({

	init: function (mass, restitution) {
		this.mass = mass;
		this.restitution = restitution;
		this.x = 0;
		this.y = 0;
		this.dx = 0;
		this.dy = 0;
		this.rotation = 0;
	},

	doBoxToBoxCollide: function (box1, box2) {
		box1.updateMinMax();
		box2.updateMinMax();
		if(box1.max.x < box2.min.x || box1.min.x > box2.max.x) return false;
		if(box1.max.y < box2.min.y || box1.min.y > box2.max.y) return false;

		return true
	},

	doCircleToCircleCollide: function (circle1, circle2) {
		if (getDistanceBetween(circle1.x, circle1.y, circle2.x, circle2.y) < circle1.radius + circle2.radius) {
			return true;
		}

		return false;
	},

	getVelocityInWorldReference: function () {
		return [
			this.dy * Math.cos(this.rotation) + this.dx * Math.cos(this.rotation - Math.PI / 2),
			this.dy * Math.sin(this.rotation) + this.dx * Math.sin(this.rotation - Math.PI / 2)
		];
	}

});
