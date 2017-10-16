// ask for user's name on the first try
// if user enters nothing, then ask for name until they enter something
var person = prompt("Please enter your name.");	
while(person == '' || $.trim(person) == '' || person.length > 8)
    person = prompt("No name entered or name exceeds 8 characters. Please enter your name.");

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
    
    // if minutes is less than 10, add an extra 0 in front of the number
    if(minutes < 10)
        minutes = '0' + minutes;

	// convert the 24 hour clock to 12 hour
	if (hours > 12) {
		hours -= 12;
		time_string = hours + ":" + minutes + " pm";
	}
	else if(hours == 0) {
		hours = 12;
		time_string = hours + ":" + minutes + " am";
	}
	else
		time_string = hours + ":" + minutes + " am";

	// forward the message by appending to the table
    if(data.user_match == 1)
        $('#messages').append('<tr><td><img class="img-cirlce img-profile" src="img/profile/user.png">' + data.user_name + '</td><td class="user-message">' + data.user_msg + '</td><td class="user-message">' + time_string + '</td></tr>');
    else
        $('#messages').append('<tr><td></td><td class="user-message">' + data.user_msg + '</td><td class="user-message">' + time_string + '</td></tr>');
	
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