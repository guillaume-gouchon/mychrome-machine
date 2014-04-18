function Physics (game) {

	var game = game;

	this.update = function () {
		var collisions = [];
		var allLength = game.objects.length;
		for (var i = 0; i < allLength; i++) {
			var active = game.objects[i]; 
			for (var j = 0; j < allLength; j++) {
				var passive = game.objects[j];
				if (active != passive && active.doCollideWith(passive)) {
					var impulse = this.resolveCollision(active, passive);
					if (impulse != null) {
						collisions.push({ element: active, impulse: impulse });
					}
				}
			}
		}

		// resolve collision impulses
		var collisionsLength = collisions.length;
		for (var i = 0; i < collisionsLength; i++) {
			var collision = collisions[i];
			var impulse = collision.impulse;
			collision.element.dx = collision.element.dx * 0.3 + impulse[0];
			collision.element.dy += impulse[1];
		}
	};


	/**
	*	Resolve action of element2 on element1
	*/
	this.resolveCollision = function (element1, element2) {
		if (element1.mass == 0) {
			return null
		}

		// calculate relative velocity
		var velocity1 = element1.getVelocityInWorldReference();
		var velocity2 = element2.getVelocityInWorldReference();
		var  rvx = velocity2[0] - velocity1[0];
		var  rvy = velocity2[1] - velocity1[1];

		// calculate relative velocity in terms of the normal direction
	  	var velAlongNormal = rvx * (element2.x - element1.x) + rvy * (element2.y - element1.y);
	 
		// do not resolve if velocities are separating
		if(velAlongNormal > 0) return null;

		// calculate restitution
		var e = Math.min(element1.restitution, element2.restitution);

		// calculate impulse scalar
		var impulseScalarConstant = 0.04 * (1 + e) / (1 + (element2.mass == 0 ? 0 : element1.mass / element2.mass));
		var j = impulseScalarConstant * velAlongNormal;

		// apply impulse
		var impulse = [
			j * (element2.x - element1.x) / getDistanceBetween(element1.x, element1.y, element2.x, element2.y) * Math.cos(element1.rotation), 
			j * (element2.y - element1.y) / getDistanceBetween(element1.x, element1.y, element2.x, element2.y) * Math.sin(element1.rotation)
		];

		return impulse;	
	}

}
