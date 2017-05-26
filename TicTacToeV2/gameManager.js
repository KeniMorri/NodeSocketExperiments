var player1;
var player2;
var boardLayout;
var currentPlayersTurn;
var gameStatus;

//Setup variables
var init = function() {
	this.boardLayout = ['','','','','','','','',''];
	this.gameStatus = 'waiting';
}

//Used to Clean the board when players leave or game has completed
var clean = function() {
	this.player1 = '';
	this.player2 = '';
	this.boardLayout = ['','','','','','','','',''];
	this.currentPlayersTurn = '';
	this.gameStatus = 'waiting';
}

//Packages all Game Data for quick Sync with clients
var packageGame = function() {
	console.log('Attempting to package game info');
	var player1txt = 'N/A';
	var player2txt = 'N/A';
	var currentPlayersTurntxt = 'N/A';
	if(player1) { player1txt = this.player1.username }
	if(player2) { player2txt = this.player2.username }
	if(currentPlayersTurn) { currentPlayersTurntxt  = this.currentPlayersTurn.username }
	var urlBoardLayout = ['','','','','','','','',''];
	for(i = 0; i < 9; i++) {
		if(this.boardLayout[i] == 'x') { urlBoardLayout[i] = '/public/X.png'; }
		else if(this.boardLayout[i] == 'o') { urlBoardLayout[i] = '/public/O.png'; }
		else { urlBoardLayout[i] = '/public/White.png'; }
	}
	var pack = {
		player1: player1txt,
		player2: player2txt,
		boardLayout: urlBoardLayout,
		currentPlayersTurn: currentPlayersTurntxt,
		gameStatus: this.gameStatus
	};
	return pack;
}

//Used to Add a new player to the gameManger
//Should add function to check for duplicate usernames
var registerPlayer = function(playerName) {
	if(this.player1 == '') {
		this.player1 = playerName;
	}	
	else if(this.player2 == '') {
		this.player2 = playerName;
	}
	else {
		return false;
	}
}

//This is where we modifiy the board
var modifyBoardLayout = function(move) {
	if(currentPlayersTurn.playerNum == 1) {
		this.boardLayout[move] = 'x';
	}			
	else if(currentPlayersTurn.playerNum == 2) {
		this.boardLayout[move] = 'o';
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
