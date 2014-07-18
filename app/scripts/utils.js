window.requestAnimFrame = (function (callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function (callback) {
	  window.setTimeout(callback, 1000 / 60);
	};
})();

function degToRad(deg) {
	return deg * Math.PI / 180;
}

function getTranslationDiff(distance, angle) {
    if (angle > 0  && angle < Math.PI) {
        return [distance * Math.cos(angle), distance * Math.sin(angle)];
    } else {
        return [distance * Math.cos(angle), - distance * Math.sin(angle + Math.PI)];
    }
}

function getDistanceBetween(x1, y1, x2, y2) {
	return Math.pow(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2), 0.5);
}
