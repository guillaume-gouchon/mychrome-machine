// player constants
var GAMEPAD_PLAYER = 0;
var PHONEPAD_PLAYER = 1;
var KEYBOARD_PLAYER = 2;

function Player (id, type, extra) {
	this.id = id;
	this.type = type;
	this.extra = extra;
}
