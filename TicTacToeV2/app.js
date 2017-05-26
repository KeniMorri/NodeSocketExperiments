var express = require('express');
var session = require('cookie-session');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.get('/', function(req, res) {
	res.render(__dirname + '/views/index.ejs');
});

app.use(session({secret: 'todotopsecret'}));

app.use('/public', express.static('public'));

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
		res.status(404).send('Page cannot be found!');
});

io.sockets.on('connection', function(socket) {




	socket.on('disconnect', function() {

	})
});


app.listen(8080);
