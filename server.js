// require dependencies
var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// array variable to hold user name and user id
var users = [];
var users_id = [];

// the port number for the server to listen to
var port_number = 8000;
var current_user = 1000;

// load the index html file
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

// set up directory for files
app.use(express.static('static'));

// receives data from client
io.on('connection', function(socket) {
	//add user name to array and user id
	socket.on('connection name', function(person) {
		users.push(person.user_name);
		users_id.push(socket.id);
		io.emit('users update', users);
	});

	// send data to the clients
  	socket.on('chat message', function(data) {
        if(current_user == users.indexOf(data.user_name))
            io.emit('chat message', {user_name: data.user_name, user_msg: data.user_msg, user_profile: data.user_profile, user_match: '0'});
        else {
            io.emit('chat message', {user_name: data.user_name, user_msg: data.user_msg, user_profile: data.user_profile, user_match: '1'});
            current_user = users.indexOf(data.user_name);
        }
  	});

  	// disconnect the user by removing from both arrays
	socket.on('disconnect', function() {
	    var id = users_id.indexOf(socket.id);
	    users.splice(id, 1);
	    users_id.splice(id, 1);
        current_user = 1000;
	    io.emit('users update', users);
	});
});

// listen to the port 8000
http.listen(port_number, function(){
	console.log('listening on: ' + port_number);
});