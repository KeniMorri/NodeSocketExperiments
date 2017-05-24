var http = require('http');
var fs = require('fs');
var gameManager = require('./gameManager');



var server = http.createServer(function(req, res) {
	fs.readFile('./index.html', 'utf-8', function(error,content) {
		res.writeHead(200, {"Content-Type": "text/html"});
		res.end(content);
	});
});
var player1 = false;
var player2 = false;
var turn = 1;

var io = requide('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
	console.log('A client has connected');

sockets.on('join', function(username) {
	socket.username = username;
	if(player1 == false) {
		socket.player = 1;
		player1 = true;
	}	
	else if(player2 == false) {
		socket.player = 2;
		player2 = true;
	}
	if(player1 == true && player2 == true) {
		if(Math.round(Math.random() * 2) == 1) {
			
		socket.emit('gameStart',
		socket.broadcast.emit('gameStart', 
	}
});

});
server.listen(8080);
