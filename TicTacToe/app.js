var http = require('http');
var fs = require('fs');
var gameManager = require('./gameManager');

var server = http.createServer(function(req, res) {
	fs.readFile('./index.html', 'utf-8', function(error,content) {
		res.writeHead(200, {"Content-Type": "text/html"});
		res.end(content);
	});
});

gameManager.init();

var io = require('socket.io').listen(server);
var allClients = [];
var turn;
var clientNumber = 0;

io.sockets.on('connection', function(socket) {
	allClients.push(socket);
	socket.name = 'guest' + clientNumber++;
	socket.emit('firstlogin', {
		name: socket.name,
		board: gameManager.getBoard(),
		player1: gameManager.getP1(),
		player2: gameManager.getP2()
	});
	console.log('A client has connected');

socket.on('debug', function(data) {
	console.log('debugging');
	var tmp = gameManager.getP1();
	console.log(tmp);
	socket.emit('debug', tmp);
})

socket.on('join', function(username) {
	console.log(username + ' has joined the game');
	if(gameManager.registerPlayer(username) ) {
		socket.name = username;
		if(gameManager.getP2()) {
			io.sockets.emit('registered', {
				player: '2',
				playerName: gameManager.getP2()
			});
		}
		else if(gameManager.getP1()) {
			io.sockets.emit('registered', {
				player: '1',
				playerName: gameManager.getP1()
			});
		}
		if(gameManager.getP1() && gameManager.getP2()) {
			console.log('Game starting');
			io.sockets.emit('gameStart', {
				board: gameManager.getBoard(),
				player1: gameManager.getP1(),
				player2: gameManager.getP2(),
				turn: gameManager.getTurn()
			});
			io.sockets.emit('turnStart', {
				board: gameManager.getBoard(),
				turn: gameManager.getTurn()
			});
		}
	}
})


socket.on('clickedSquare', function(selectedSquare) {
	console.log("Square has been clicked: " + selectedSquare );
	gameManager.placeMark(selectedSquare, socket.name);
	io.sockets.emit('turnStart', {
		board: gameManager.getBoard(),
		turn: gameManager.getTurn()
	});
	if(gameManager.checkBoardStatus()) {
		//emit games end
	}	
})

socket.on('disconnect', function() {
      console.log('Got disconnect!');
			//Insert Message to chatroom that user has disconnected
			if(socket.player = true) {
			//Cancel the current game
			}
      var i = allClients.indexOf(socket);
      delete allClients[i];
   });

});
server.listen(8080);
