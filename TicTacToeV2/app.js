var session = require('cookie-session');
var express = require('express');
var app = new express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var gameManager = require('./gameManager')(io);


app.get('/', function(req, res) {
	res.render(__dirname + '/views/index.ejs');
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
