// list of different sounds
var GAME_SOUNDS = {
	mainMusic: new Sound('main_music', 0),
	trafficLight: new Sound('traffic_light', 0),
	start: new Sound('start', 0),
	accelerate: new Sound('accelerate', 1),
	glide: new Sound('glide', 2),
	crash: new Sound('crash', 3),
	carOut: new Sound('car_out', 0),
	victory: new Sound('victory', 0)
};

function SoundManager () {

	this.SOUND_PATH = 'sounds/';

	this.audioFilesFormat = null;
	this.soundEnabled = true;
	this.audioTags = [];

	this.init = function () {
		this.audioTags = $('audio', '#audioTags');
		var audioTag = this.audioTags[0];
		if(audioTag.canPlayType('audio/ogg') != '') {
	        this.audioFilesFormat = '.ogg';
	    } else if(audioTag.canPlayType('audio/mp3') != '') {
	        this.audioFilesFormat = '.mp3';
	    }

	    // sound effects
	    for (var i = 1; i < this.audioTags.length; i++) {
	    	var audioTag = this.audioTags[i];
	    	audioTag.volume = 0;
	    	audioTag.onended = function () {
	    		audioTag.volume = Math.max(0, audioTag.volume - 0.05);
	    	}
	    }
	};

	this.play = function (sound) {
		if (this.audioFilesFormat != null) {
			var audioTag = this.audioTags[sound.category];

			if (sound.category == 0) {
				audioTag.src = this.SOUND_PATH + sound.name + this.audioFilesFormat;
			} else {
				if (audioTag.src == '') {
					audioTag.src = this.SOUND_PATH + sound.name + this.audioFilesFormat;
				}
				audioTag.volume = Math.min(0.6, audioTag.volume + 0.05)
			}
			audioTag.play();
		}
	};

}
