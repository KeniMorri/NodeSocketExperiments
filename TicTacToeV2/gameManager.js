
module.exports = function(io) {

io.on('connection', function(socket) {
	socket.on('debug', function() {
		socket.emit('debug', 'Msg Received');
	});
});
/*
	console.log("Enter Exports module");
	io = socket.io.listen(app);
	users = io.of('/users');
	users.on('connection', function(socket) {
		console.log('User connected received by internal module');
		socket.on('debug', function() {
			console.log('Msg received');
			socket.emit('debugRec', 'Message Received');
		})
	});
	users.on('debug', function(socket) {
		socket.on('debug', function() {
			console.log('Msg received');
			socket.emit('debugRec', 'Message Received');
		})
	});
	return io;
*/
};
