function Physics () {
	
	this.active = [];
	this.all = [];

	this.addActiveElement = function (element) {
		this.active.push(element);
		this.all.push(element);
	};


	this.update = function () {
		var collisions = [];
		var activeLength = this.active.length;
		var allLength = this.all.length;
		for (var i = 0; i < activeLength; i++) {
			var active = this.active[i]; 
			for (var j = 0; j < allLength; j++) {
				var passive = this.all[j];
				if (active != passive && active.doCollideWith(passive)) {
					var impact = this.resolveCollision(active, passive);
					if (impact != null) {
						collisions.push({ active: active, passive: passive, impact: impact });
					}
				}
			}
		}

		// resolve collision impacts
		var collisionsLength = collisions.length;
		for (var i = 0; i < collisionsLength; i++) {
			var collision = collisions[i];
			var impact = collision.impact;
			console.log(impact)
			collision.active.dx -= impact[0] / 500;
			collision.active.dy -= impact[1] / 500;
			collision.passive.dx += impact[0] / 500;
			collision.passive.dy += impact[1] / 500;
		}
	};


	this.resolveCollision = function (element1, element2) {
		// calculate relative velocity
		var velocity1 = element1.getVelocityInWorldReference();
		var velocity2 = element2.getVelocityInWorldReference();
		var  rvx = velocity2[0] - velocity1[0];
		var  rvy = velocity2[1] - velocity1[1];

		// calculate relative velocity in terms of the normal direction
	  	var velAlongNormal = rvx * (element2.x - element1.x) + rvy * (element2.y - element1.y);
	 
		// do not resolve if velocities are separating
		if(velAlongNormal > 0)
		return;

		// calculate restitution
		var e = Math.min(element1.restitution, element2.restitution);

		// calculate impulse scalar
		var j = (1 + e) * velAlongNormal / (1 / element1.mass + 1 / element2.mass);

		// apply impulse
		var impulse = [j * (element2.x - element1.x) / Math.abs((element2.x - element1.x)) , j * (element2.y - element1.y) / Math.abs((element2.x - element1.x))];
		return [1 / element1.mass * impulse[0], 1 / element1.mass * impulse[1]];

		
	}

}