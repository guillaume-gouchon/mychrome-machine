

window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
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

/**
*	FULLSCREEN
*/
function requestFullscreen () {
	var element = document.body;

	var fullscreenchange = function ( event ) {
		if ( !(document.fullscreenElement === element || document.mozFullscreenElement === element ||
					document.mozFullScreenElement === element || document.webkitFullscreenElement === element ||
					document.webkitfullscreenElement === element)) {
			// Exiting fullscreen mode: overlay the instruction screen and disable mouse control
			var blocker = document.getElementById('blocker');
			blocker.classList.remove('hidden');
			controls.enabled = false;
		} else {
			// Entering fullscreen mode: enable the mouse control
			controls.enabled = true;
		}
	}

	document.addEventListener( 'fullscreenchange', fullscreenchange, false );
	document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
	document.addEventListener( 'webkitfullscreenchange', fullscreenchange, false );

	// Ask the browser for fullscreen mode
	if (element.requestFullscreen) {
		// W3C standard
		element.requestFullscreen();
	} else if (element.mozRequestFullScreen) {
		// Firefox 10+, Firefox for Android
		element.mozRequestFullScreen();
	} else if (element.msRequestFullscreen) {
		// IE 11+
		element.msRequestFullscreen();
	} else if (element.webkitRequestFullscreen) {
		if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
			// Safari 6+
			element.webkitRequestFullscreen();
		} else {
			// Chrome 20+, Opera 15+, Chrome for Android, Opera Mobile 16+
			element.webkitRequestFullscreen(element.ALLOW_KEYBOARD_INPUT);
		}
	} else if (element.webkitRequestFullScreen) {
		if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
			// Safari 5.1+
			element.webkitRequestFullScreen();
		} else {
			// Chrome 15+
			element.webkitRequestFullScreen(element.ALLOW_KEYBOARD_INPUT);
		}
	}

}