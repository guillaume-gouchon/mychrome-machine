// sound constants
var GAME_SOUNDS = {
	accelerate: '',
	brake: '',
	crash: '',
	explosion: '',
	glide: '',
	trafficLights: '',
	victory: ''
};


function SoundManager () {

	this.audioFilesFormat = null;
	this.soundEnabled = true;
	this.audioTags = [];

	this.init = function () {
		this.audioTags = $('audio', '#audioTags');
		var audioTag = this.audioTags[0];
		if(audioTag.canPlayType('audio/ogg') != ''){
	        this.audioFilesFormat = '.ogg';
	    } else if(audioTag.canPlayType('audio/mp3') != ''){
	        this.audioFilesFormat = '.mp3';
	    }
	};

	this.playSound = function (sound) {
		if (gameManager.musicEnabled && this.audioFilesFormat != null) {
			this.soundTag.src = this.MUSIC_FILES_PATH + 'so_' + filename + this.audioFilesFormat;
			this.soundTag.play();
		}
	};
}
