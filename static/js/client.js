// ask for user's name on the first try
// if user enters nothing, then ask for name until they enter something
var person = prompt("Please enter your name.");	
while(person === '' || $.trim(person) === '')
    person = prompt("No name entered. Please enter your name.");

var socket = io();
socket.emit('connection name', {user_name: person});

// send the data to the server to broadcast to everyone
$('form').submit(function(e){
	e.preventDefault();
    var message = $('#message_button').val();
    
    // make sure there is value in the input before sending it off to the server
    if(message != '' && $.trim(message) != '') {
        socket.emit('chat message', {user_name: person, user_msg: message});
        $('#message_button').val('');
        return false;
    }
});

// display different colors for each up to 6 users
socket.on('chat message', function(data) {
	// grab the time
	var time = new Date();
	var hours = time.getHours();
	var minutes = time.getMinutes();
	var time_string = "";

	// convert the 24 hour clock to 12 hour
	if (hours > 12) {
		hours -= 12;
		time_string = hours + ":" + minutes + " pm";
	}
	else if(hours == 0)
	{
		hours = 12;
		time_string = hours + ":" + minutes + " am";
	}
	else
		time_string = hours + ":" + minutes + " am";

	// assign different colors to different users
	if((data.user_id % 6) == 0)
		$('#messages').append('<tr><td> ' + data.user_name + ' </td><td>' + data.user_msg + '</td><td> ' + time_string + ' </td></tr>');
	else if((data.user_id % 6) == 1)
		$('#messages').append('<tr class="active"><td> ' + data.user_name + ' </td><td>' + data.user_msg + '</td><td> ' + time_string + ' </td></tr>');
	else if((data.user_id % 6) == 2)
		$('#messages').append('<tr class="warning"><td> ' + data.user_name + ' </td><td>' + data.user_msg + '</td><td> ' + time_string + ' </td></tr>');
	else if((data.user_id % 6) == 3)
		$('#messages').append('<tr class="info"><td> ' + data.user_name + ' </td><td>' + data.user_msg + '</td><td> ' + time_string + ' </td></tr>');
	else if((data.user_id % 6) == 4)
		$('#messages').append('<tr class="danger"><td> ' + data.user_name + ' </td><td>' + data.user_msg + '</td><td> ' + time_string + ' </td></tr>');
	else if((data.user_id % 6) == 5)
		$('#messages').append('<tr class="success"><td> ' + data.user_name + ' </td><td>' + data.user_msg + '</td><td> ' + time_string + ' </td></tr>');
	
	// scroll to bottom of page
	$("html, body").animate({ scrollTop: $(document).height() }, "slow");
});

// updates the users connected list at the top
socket.on('users update', function(users) {
	var temp = "";
	for(i = 0; i < users.length; i++)
		temp += "<p> " + users[i] + " </p>";
	$('#users').html(temp);
});