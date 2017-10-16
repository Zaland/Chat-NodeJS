// initialize the socket
var socket = io();

$(document).ready(function() {
    $('.content2').hide();
    var person;
    var profile;
    
    $('.user-info').submit(function(e) {
        e.preventDefault();
        
        // validate user's name
        // check for length, must be less than 8 characters
        // also check if name only has spaces
        var error =  '<div class="alert alert-danger alert-dismissable">';
            error += '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>';
            error += 'No name entered or name exceeds 8 characters. Please enter your name.</div>';        
        person = $('.username-input').val();
        
        if(person == '' || $.trim(person) == '' || person.length > 8)
            $('.error-name').html(error);
        else {
            $('.content1').hide();
            $('.content2').show();
            profile = $("input[name='img']:checked").val();
            socket.emit('connection name', {user_name: person});
        }
    });
    
    // send the data to the server to broadcast to everyone
    $('#message-form').submit(function(e){
        e.preventDefault();
        var message = $('#message_button').val();
        console.log(message);

        // make sure there is value in the input before sending it off to the server
        if(message != '' && $.trim(message) != '') {
            socket.emit('chat message', {user_name: person, user_msg: message, user_profile: profile});
            $('#message_button').val('');
            console.log(message + "1");
            return false;
        }
    });

    // display the chat message
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
            $('#messages').append('<tr><td><img class="img-cirlce img-profile" src="img/profile/' + data.user_profile + '.png">' + data.user_name + '</td><td class="user-message">' + data.user_msg + '</td><td class="user-message">' + time_string + '</td></tr>');
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
});