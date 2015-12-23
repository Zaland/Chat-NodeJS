// require dependencies
var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// array variable to hold user name and user id
var users = [];
var users_id = [];

// load the index html file
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

// receives data from client and sends to all other clients
io.on('connection', function(socket) {
	//add user name to array and user id
	socket.on('connection name', function(person) {
		users.push(person.user_name);
		users_id.push(socket.id);
		io.emit('users update', users);
	});

	// send data to the clients
  	socket.on('chat message', function(data) {
    	io.emit('chat message', {user_name: data.user_name, user_msg: data.user_msg});
  	});

  	// disconnect the user by removing from both arrays
	socket.on('disconnect', function() {
	    var id = users_id.indexOf(socket.id);
	    users.splice(id, 1);
	    users_id.splice(id, 1);
	    io.emit('users update', users);
	});
});

// listen to the port 2500
http.listen(2500, function(){
	console.log('listening on *:2500');
});