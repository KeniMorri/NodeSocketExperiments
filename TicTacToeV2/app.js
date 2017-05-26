var session = require('cookie-session');
var express = require('express');
var app = new express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var gameManager = require('./gameManager.js');

gameManager.start(io);
gameManager.init();

app.get('/', function(req, res) {
	//Getting all relavant information of current page status
	var pack = gameManager.packageGame();
	var row1 = [pack.boardLayout[0], pack.boardLayout[1], pack.boardLayout[2]];
	var row2 = [pack.boardLayout[3], pack.boardLayout[4], pack.boardLayout[5]];
	var row3 = [pack.boardLayout[6], pack.boardLayout[7], pack.boardLayout[8]];
	res.render(__dirname + '/views/index.ejs', {
		player1: pack.player1, 
		player2: pack.player2,
		turn: pack.currentPlayersTurn,
		row1: row1,
		row2:	row2,
		row3: row3
	});
});

app.use(session({secret: 'todotopsecret'}));

app.use('/public', express.static('public'));
app.use('/js', express.static('js'));

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
		res.status(404).send('Page cannot be found!');
});





io.sockets.on('connection', function(socket) {
	console.log("Client has connected on ip: " + socket.handshake.address);


	socket.on('debug', function() {
		socket.emit('debug', 'Message Received in app.js');
	})



	socket.on('disconnect', function() {

	})
});


server.listen(8080);
