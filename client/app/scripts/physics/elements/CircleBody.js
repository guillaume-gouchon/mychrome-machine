var CircleBody = RigidBody.extend({

	init: function (radius, mass, restitution) {
		this._super(mass, restitution);
		this.radius = radius;
	},

	doCollideWith: function (element) {
		if (element instanceof CircleBody) {
			return this.doCircleToCircleCollide(this, element);
		}
		return false;
	}

});
