// This module is a dumb module that merely holds values pertaining to the game of tictactoe
var player1 = '';
var player2 = '';
var board;


var registerPlayer = function(playerID) {
	if(player1 == '') {
		player1 = playerID;
		return player1;
	}
	else if(player2 == '') {
		player2 = playerID;
		return player2;
	}
	else {
		return null;
	}
}


var wipePlayers = function() {
	player1 = '';
	player2 = '';
}

var wipeBoard = function() {
	for(i = 0;i++;i<9) {
		board[i] = '';
	}
}

var checkBoardStatus = function() {	
}

var placeMark = function(x, y, sign) {
	board[ boardParser(x,y) ] = sign;
}

var boardParser = function(x, y) {
	var returnValue;
	if(x == 1) {
		if(y == 1) {
			returnValue = 0; 
		}
		else if(y == 2) {
			returnValue = 1; 
		}
		else if(y == 3) {
			returnValue = 2; 
		}
	}
	else if(x == 2) {
		if(y == 1) {
			returnValue = 3; 
		}
		else if(y == 2) {
			returnValue = 4; 
		}
		else if(y == 3) {
			returnValue = 5; 
		}
	}
	else if(x == 3) {
		if(y == 1) {
			returnValue = 6; 
		}
		else if(y == 2) {
			returnValue = 7; 
		}
		else if(y == 3) {
			returnValue = 8; 
		}
	}
	return returnValue;
}
