var session = require('cookie-session');
var express = require('express');
var app = new express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var cloudScraper = require('cloudscraper');
var fs = require('fs');



cloudScraper.request(
	{method: 'GET',
	url:'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&gadget=a&no_expand=1&resize_h=0&rewriteMime=image%2F*&url=http%3a%2f%2fimg.bato.to%2fcomics%2f2017%2f02%2f11%2fr%2fread589e903c63e2b%2fimg000001.png&imgmax=30000',
	encoding: null,
	}, function(err, res, body) {
		console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

		fs.writeFileSync("staging/Test.png", body, 'binary');
    //body.pipe(fs.createWriteStream("test.img")).on('close', callback);		
});

app.get('/', function(req, res) {
	res.render(__dirname + '/views/index.ejs');
});

app.get('/normal', function(req, res) {
	res.render(__dirname + '/views/normal.ejs');
});
app.get('/cut', function(req, res) {
	res.render(__dirname + '/views/cut.ejs');
});
app.get('/zoom', function(req, res) {
	res.render(__dirname + '/views/znormal.ejs');
});
app.get('/zoomcut', function(req, res) {
	res.render(__dirname + '/views/zcut.ejs');
});
app.get('/exp', function(req, res) {
	res.render(__dirname + '/views/exp.ejs');
});

app.use(session({secret: 'todotopsecret'}));

app.use('/rough', express.static('Rough'));
app.use('/cut', express.static('RoughCut'));
//app.use('/js', express.static('js'));
/*
app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
		res.status(404).send('Page cannot be found!');
});
*/




io.sockets.on('connection', function(socket) {
	console.log("Client has connected on ip: " + socket.handshake.address);


	socket.on('debug', function() {
		socket.emit('debug', 'Message Received in app.js');
	})



	socket.on('disconnect', function() {

	})
});


server.listen(8080);
