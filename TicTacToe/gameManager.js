// This module is a dumb module that merely holds values pertaining to the game of tictactoe
var _player1 = '';
var _player2 = '';
var _board = ['','','','','','','','',''];
var _turn = '';
var _ready = false;

var init = function() {
this._player1 = '';
this._player2 = '';
this._board = ['','','','','','','','',''];
this._turn = '';
this._ready = false;
}



var registerPlayer = function(playerID) {
	if(this._player1 == '') {
		this._player1 = playerID;
	}
	else if(this._player2 == '') {
		this._player2 = playerID;
	}
	else {
		return false;
	}
	if(this._player1 && this._player2) {
		this._ready = true;
		this._turn = this._player1;
	}
	return true;
}


var wipePlayers = function() {
	_player1 = '';
	_player2 = '';
}

var wipeBoard = function() {
	for(i = 0;i++;i<9) {
		this._board[i] = '';
	}
}

var checkBoardStatus = function() {	
}

var placeMark = function(selectedSquare, name) {
	console.log('Player Name:' + name);
	var sign = '';
	if(name == _player1) {
		sign = 'x';	
	}
	else {
		sign = 'o';
	}
	this._board[selectedSquare] = sign;
	console.log('Board: ' + this._board);
}

exports.getReady = function() { return this._ready; }
exports.getBoard = function() { return this._board; }
exports.getP1 = function() { return this._player1; } 
exports.getP2 = function() { return this._player2; }
exports.getTurn = function() { return this._turn; }
exports.init = init;
exports.registerPlayer = registerPlayer;
exports.placeMark = placeMark;
exports.checkBoardStatus = checkBoardStatus;
