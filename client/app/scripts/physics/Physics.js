function Physics () {

	this.update = function () {
		var collisions = [];
		var allLength = game.objects.length;
		for (var i = 0; i < allLength; i++) {
			var active = game.objects[i];
			if (collisions.indexOf(active) == -1) {
				for (var j = 0; j < allLength; j++) {
					var passive = game.objects[j];
					if (active != passive && active.doCollideWith(passive)) {
						var impulsePassive = this.resolveCollision(active, passive);
						var impulseActive = this.resolveCollision(passive, active);
						if (impulseActive != null) {
							active.dx = impulseActive[0];
							active.dy = impulseActive[1];
						}
						if (impulsePassive != null) {
							passive.dx = impulsePassive[0];
							passive.dy = impulsePassive[1];
						}
						collisions.push(passive);
						soundManager.play(GAME_SOUNDS.crash);
						break;
					}
				}
			}
		}
	};


	/**
	*	Resolve action of active on passive.
	*/
	this.resolveCollision = function (active, passive) {
		if (passive.mass == 0) return null;

		// calculate relative velocity
		var velocity1 = passive.getVelocityInWorldReference();
		var velocity2 = active.getVelocityInWorldReference();
		var  rvx = velocity2[0] - velocity1[0];
		var  rvy = velocity2[1] - velocity1[1];

		// calculate relative velocity in terms of the normal direction
	  	var velAlongNormal = rvx * (active.x - passive.x) + rvy * (active.y - passive.y);
	 
		// do not resolve if velocities are separating
		if (velAlongNormal > 0) return null;

		// calculate restitution
		var res = Math.min(passive.restitution, active.restitution);

		// calculate impulse scalar
		var massRatio = active.mass == 0 ? 1 : (passive.mass == 0 ? 0 : 2.2 * active.mass / passive.mass);
		var impulseScalarConstant = 0.01 * (1 + res) * massRatio;
		var j = Math.abs(impulseScalarConstant * velAlongNormal);

		var dx = j * (active.x - passive.x) / getDistanceBetween(passive.x, passive.y, active.x, active.y);
		var dy = j * (active.y - passive.y) / getDistanceBetween(passive.x, passive.y, active.x, active.y);

		// apply impulse
		var impulse = [
			dy * Math.cos(passive.rotation) + dx * Math.sin(passive.rotation), 
			dy * Math.sin(passive.rotation + Math.PI) - dx * Math.cos(passive.rotation)
		];

		return impulse;
	}

}
