var player1;
var player2;
var boardLayout;
var currentPlayersTurn;
var gameStatus;
var TestVar = 0;
var self;


//Setup variables
var init = function() {
	self = this;
	self.player1 = '';
	self.player2 = '';
	self.boardLayout = ['','','','','','','','',''];
	self.currentPlayersTurn = '';
	self.gameStatus = 'waiting';
}

//Used to Clean the board when players leave or game has completed
var clean = function() {
	self.player1 = '';
	self.player2 = '';
	self.boardLayout = ['','','','','','','','',''];
	self.currentPlayersTurn = '';
	self.gameStatus = 'waiting';
}

//Packages all Game Data for quick Sync with clients
var packageGame = function() {
	console.log('Attempting to package game info');
	var player1txt = 'N/A';
	var player2txt = 'N/A';
	var currentPlayersTurntxt = 'N/A';
	if(self.player1) { player1txt = self.player1.username }
	if(self.player2) { player2txt = self.player2.username }
	if(self.currentPlayersTurn) { currentPlayersTurntxt  = self.currentPlayersTurn.username }
	/* Depreciated for function
	for(i = 0; i < 9; i++) {
		if(this.boardLayout[i] == 'x') { urlBoardLayout[i] = '/public/X.png'; }
		else if(this.boardLayout[i] == 'o') { urlBoardLayout[i] = '/public/O.png'; }
		else { urlBoardLayout[i] = '/public/White.png'; }
	}
	*/
	var tmpBoardLayout = convertBoardToUrl(false);
	console.log(tmpBoardLayout);
	var pack = {
		player1: player1txt,
		player2: player2txt,
		boardLayout: tmpBoardLayout,
		currentPlayersTurn: currentPlayersTurntxt,
		gameStatus: self.gameStatus
	};
	return pack;
}

//Converts the signs into urls
//Got stuck here forever cuz of this vs. self ugh
var convertBoardToUrl = function(playerTurn) {
	var tmpBoard = ['','','','','','','','',''];
	var whiteUrl = '/public/White.png';
	if(playerTurn) { whiteUrl = '/public/Place.png'; }
	for(i = 0; i < 9; i++) {
		if(self.boardLayout[i] == 'x') { tmpBoard[i] = '/public/X.png'; }
		else if(self.boardLayout[i] == 'o') { tmpBoard[i] = '/public/O.png'; }
		else { tmpBoard[i] = whiteUrl; }
	}
	return tmpBoard;
}

//Used to Add a new player to the gameManger
//Should add function to check for duplicate usernames
var registerPlayer = function(playerName) {
	console.log('Attempting to add new player: ' + playerName);
	if(self.player1 == '') {
	console.log('P1: ' + self.player1 + ' P2: ' + self.player2);
		//self.player1 = playerName;
		return 1;
	}	
	else if(self.player2 == '') {
		//self.player2 = playerName;
		return 2;
	}
	else {
		return false;
	}
}

//This is where we modifiy the board
var modifyBoardLayout = function(move) {
	if(currentPlayersTurn.playerNum == 1) {
		self.boardLayout[move] = 'x';
	}			
	else if(currentPlayersTurn.playerNum == 2) {
		self.boardLayout[move] = 'o';
	}	
	else {
		return false;
	}
	return true;
}

//This is where I would check for a win condition
var checkBoardStatus = function() {
	
}



exports.init = init;
exports.packageGame = packageGame;
exports.start = function(io) {
		io.on('connection', function(socket) {
			//Respond to players request to join game
			socket.on('join game', function(username) {
				console.log(username + ' is trying to join game');
				//Alright, this is pretty much an entire mess, should fix it later
				var playerNumber = registerPlayer(username);
				if(playerNumber) {
					console.log(username + ' successfully registered with game as player ' + playerNumber);
					socket.username = username;
					if(playerNumber == 1) { socket.playerNum = 1; self.player1 = socket; }	
					else if(playerNumber == 2) { socket.playerNum = 2; self.player2 = socket; }	
					socket.playing = true;
					io.sockets.emit('sync', packageGame());
					if(player1 && player2) {
						console.log('Game Starting between ' + this.player1.username + ' and ' + this.player2.username);
						if( (Math.floor(Math.random() * 2) + 1) == 1) { this.currentPlayersTurn = this.player1; }   	
						else { this.currentPlayersTurn = this.player2;}
						gameStatus = 'playing';
						io.sockets.emit('sync', packageGame());
						this.currentPlayersTurn.emit('startTurn', convertBoardToUrl(true));
					}		
				}
				else {
					socket.emit('error', 'Game is full, how did you even join, stop modifying my javascript >:V');
				}
			});
			socket.on('playersMove', function(move) {
				console.log(socket.username + ' is attempting to play in square ' + move);
				if(modifyBoardLayout(move)) {
					console.log(socket.username + ' move was successful');
					io.sockets.emit('sync', packageGame());
					if(this.currentPlayerTurn == this.player1) { currentPlayerTurn = this.player2; }
					else if(this.currentPlayerTurn == this.player2) { currentPlayerTurn = this.player1; }
					this.currentPlayersTurn.emit('startTurn', convertBoardtoUrl(true));
				}	
				else {	socket.emit('error', 'Move is illegal?'); }
			});
			socket.on('debug', function() {
				socket.emit('debug', 'Msg Received');
			});
		})
	}




/*
module.exports = function(io) {
	
	io.on('connection', function(socket) {
		//Respond to players request to join game
		socket.on('join game', function(username) {
			console.log(username + ' is trying to join game');
			var playerNumber = registerPlayer(username);
			if( playerNumber) {
				console.log(username + ' successfully registered with game');
				socket.username = username;
				if(playerNumber == 1) { socket.playerNum = 1; this.player1 = socket; }	
				else if(playerNumber == 2) { socket.playerNum = 2; this.player2 = socket; }	
				socket.playing = true;
				if(player1 && player2) {
					console.log('Game Starting between ' + this.player1.username + ' and ' + this.player2.username);
					if( (Math.floor(Math.random() * 2) + 1) == 1) { this.currentPlayersTurn = this.player1; }   	
					else { this.currentPlayersTurn = this.player2;}
					gameStatus = 'playing';
					io.sockets.emit('sync', packageGame());
					this.currentPlayersTurn.emit('startTurn', 'Good Luck');
				}		
			}
			else {
				socket.emit('error', 'Game is full, how did you even join, stop modifying my javascript >:V');
			}
		});
		socket.on('playersMove', function(move) {
			console.log(socket.username + ' is attempting to play in square ' + move);
			if(modifyBoardLayout(move)) {
				console.log(socket.username + ' move was successful');
				io.sockets.emit('sync', packageGame());
				if(this.currentPlayerTurn == this.player1) { currentPlayerTurn = this.player2; }
				else if(this.currentPlayerTurn == this.player2) { currentPlayerTurn = this.player1; }
				this.currentPlayersTurn.emit('startTurn', 'Good Luck');
			}	
			else {	socket.emit('error', 'Move is illegal?'); }
		});
		socket.on('debug', function() {
			socket.emit('debug', 'Msg Received');
		});
	})
};




*/
