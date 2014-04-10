var BoxBody = RigidBody.extend({

	init: function (width, height, mass, restitution) {
		this._super(mass, restitution);
		this.width = width;
		this.height = height;
		
		this.diagonal = Math.pow(this.width * this.width + this.height * this.height, 0.5);
	},

	doCollideWith: function (element) {
		if (element instanceof BoxBody) {
			return _super.doBoxToBoxCollide(this, element);
		}
		return false;
	},

	updateMinMax: function () {
		this.min = null;

		for (var i = 0; i < 4; i++) {
		}
	}

});
