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
		//self.player1 = playerName;
		return 1;
	}	
	else if(self.player2 == '') {
		//self.player2 = playerName;
		return 2;
	}
	else {
		return 0;
	}
}

//This is where we modifiy the board
var modifyBoardLayout = function(move) {
	var sign = '';
	if(self.currentPlayersTurn.playerNum == 1) {
		sign = 'x';
	}			
	else if(self.currentPlayersTurn.playerNum == 2) {
		sign = 'o';
	}	
	else { 
		console.log('Somehow player was not assigned a playerNum: ' + self.currentPlayersTurn.playerNum);
		return false; 
	}
	if(self.boardLayout[move] == '') {	
		self.boardLayout[move] = sign;
	}
	else { 
		console.log('boardLayout isnt empty?: ' + self.boardLayout);
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



			//Respond to players requesting to join game
			socket.on('join game', function(username) {
				console.log(username + ' is trying to join the game');
				//Ask gameManager if theres room for player
				var playerNumber = registerPlayer(username);

				//If they were sucessful in join attempt move on
				if(playerNumber) {
					console.log(username + ' successfully registered with game as player ' + playerNumber);
					
					//Save info about current player in socket for later use	
					socket.username = username;	
					socket.player = true;
					//Attach more info onto socket, and then get a reference to the clients socket
					if(playerNumber == 1) { socket.playerNum = 1; self.player1 = socket; }	
					else if(playerNumber == 2) { socket.playerNum = 2; self.player2 = socket; }	
				
					//Refresh all clients data(Mostly used to refresh player names and such)
					io.sockets.emit('sync', packageGame());

					//If both players exist, that means we can start the game	
					if(self.player1 && self.player2) {
						console.log('Game Starting between ' + self.player1.username + ' and ' + self.player2.username);
						//Used to determine who goes first
						if( (Math.floor(Math.random() * 2) + 1) == 1) { self.currentPlayersTurn = self.player1; }   	
						else { self.currentPlayersTurn = self.player2;}
						self.gameStatus = 'playing';

						//Update clients again to show current turn 
						io.sockets.emit('sync', packageGame());
						
						//tell current player to play, thus updating their play field
						self.currentPlayersTurn.emit('startTurn', convertBoardToUrl(true));
					}		
					
				}
				else {
					console.log('Game is full');
					//socket.emit('error', 'Game is full');
				}
			});
			//Process Player Move
			socket.on('playersMove', function(move) {
				console.log(socket.username + ' is attempting to play in square ' + move);
				//Check to see if msg sent was from correct player
				if(socket == self.currentPlayersTurn) {
					//Try to play what the player wanted
					if(modifyBoardLayout(move)) {
						console.log(socket.username + ' move was successful');
						io.sockets.emit('sync', packageGame());
						if(self.currentPlayersTurn == self.player1) { self.currentPlayersTurn = self.player2; }
						else if(self.currentPlayersTurn == self.player2) { self.currentPlayersTurn = self.player1; }
						self.currentPlayersTurn.emit('startTurn', convertBoardToUrl(true));
					}		
					else {	
						console.log('Move is illegal');
						//socket.emit('error', 'Move is illegal?'); 
					}
				}
				else {
					console.log('Move failed, not players turn');
				}
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
