	var socket = io.connect('192.168.1.80:8080');
	var gameStatus = 'waiting';
	
	var layoutBoard = function(boardLayout) {
		boardLayout.forEach(function(url, index) {
			$('#b' + index).find('img').attr('src', url);
		});	
	};
	$('#debug').click(function() {
		console.log("Debug Clicked");
		socket.emit('debug', "debug");
	});
	$('#joinGame').click(function() { 
		var username = prompt('What Shall I call you?');
		socket.emit('join game', username);
	});
	socket.on('sync', function(pack) {
		console.log('Syncing Information');
		$('#player1').html(pack.player1);
		$('#player2').html(pack.player2);
		$('#turn').html(pack.currentPlayersTurn);	
		gameStatus = pack.gameStatus;
		layoutBoard(pack.boardLayout);
	});
	socket.on('startTurn', function(boardLayout) {
		console.log('Starting Turn');
		layoutBoard(boardLayout);	
		for(i=0;i<9;i++) {
				$('#b' + i).unbind('click');
		}
		for(i=0;i<9;i++) {
			if($('#b' + i).attr('marked') != false) {
				$('#b' + i).click(function() {
					socket.emit('playersMove', $(this).attr('id')[1]);	
				});
				
			}
		}
	});
	socket.on('moveAcknowledged', function() {
		for(i=0;i<9;i++) {
				$('#b' + i).unbind('click');
		}
	});
	socket.on('debug', function(data) {
		alert(data);
	});
/*
<script>
	var socket = io.connect('192.168.1.80:8080');
	var name = '';
	var board = [];
	var player1 = '';
	var player2 = '';	
	var turn = false;
		
	$('#joinGame').click(function() {
		var username = prompt('What shall I call you?');
		socket.emit('join', username);
		name = username;
	});

	for(i = 0; i < 9; i++) {
		$('#b' + i).click(function() {
			if(turn == true) {
				socket.emit('clickedSquare', $(this).attr('id')[1]);
				turn = false;
			}
		});
	}
	$('#debug').click(function() {
		socket.emit('debug', "debug");
	});

	socket.on('debug', function(data) {
		alert(data);
	});

	socket.on('firstlogin', function(data) {
		name = data.name;
		board = data.board;
		player1 = data.player1;
		player2 = data.player2;	
		setupBoard();
	});

	socket.on('registered', function(data) {
		console.log('reg ' + data.player + " name: " + data.playerName);
		if(data.player == "1") {
			$('#player1').html(data.playerName);	
		}	
		else if(data.player == "2") {
			$('#player2').html(data.playerName);	
		}	
	});

	socket.on('gameStart', function(data) {
		console.log('Game Start');
		board = data.board;
		player1 = data.player1;
		player2 = data.player2;
		$('#joingame').prop('disabled', true);
		$('#player1').html(data.player1);
		$('#player2').html(data.player2);
		$('#turn').html(data.turn);
		board = data.board; setupBoard();	
	});
	
	socket.on('turnStart', function(data) {
		board = data.board;
		setupBoard();
		if(data.turn == name) {
			setupPlayerTurn();
		}
		$('#turn').html(turn);
	});
	
	socket.on('gameEnd', function() {
	
	});

	var setupPlayerTurn = function() {
		for(i = 0; i < 9; i++) {
			if( $('#b' + i).find('img').attr('src') == 'https://i.imgbox.com/GHjuRret.png') {	
					$('#b' + i).find('img').attr('src', 'https://i.imgbox.com/LnMbQeXo.png')	
			}
		}
		turn = true;
	}
	
	var setupBoard = function() {
		if(player1) {
			$('#player1').html(player1);
		}
		else if(player2) {
			$('#player2').html(player2);
		}
		for(i = 0; i < 9; i++) {
			if(board[i]) {
				if(board[i] == 'x') {		
					$('#b' + i).find('img').attr('src', 'https://i.imgbox.com/9op3XiQZ.png')	
				}	
				else if(board[i - 1] == 'o') {		
					$('#b' + i).find('img').attr('src', 'https://i.imgbox.com/gEm9qDeN.png')	
				}	
			}
		}
	}
</script>
*/
