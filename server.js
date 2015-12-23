// require dependencies
var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// load the index html file
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

// receives data from client and sends to all other clients
io.on('connection', function(socket){
  	socket.on('chat message', function(data){
    	io.emit('chat message', {user_name: data.user_name, user_msg: data.user_msg);
  	});
});

// listen to the port 2500
http.listen(2500, function(){
	console.log('listening on *:2500');
});