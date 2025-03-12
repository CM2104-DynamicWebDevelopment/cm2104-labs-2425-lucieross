var socket = io();
var roomJoined = false;
var currentRoom = null;

//On form submit gets the context and emits a chat message
$('#form').submit(function () {
    var message = $('#input').val();
    var username = $('#username').val(); 
    var room = $('#room').val();


    if (message && username && room) {

        if (room !== currentRoom) {
            if (currentRoom) { //Makes it so that user can switch rooms
                // Emit leave room if switching rooms so that new meessage gets displayed
                socket.emit('leave room', { room: currentRoom });
                console.log('User left room:', currentRoom);
            }
            // Emit to join the new room
            socket.emit('join room', { room: room, username: username });
            currentRoom = room;  // Update the current room
            roomJoined = true;    // Set true so the message is only disaplyed once
        }
        socket.emit('chat message', { username: username, message: message });
        $("#input").val("");
    }
    return false;
})

socket.on('chat message', function(msg) { //adds message to the message list
    $('#messages').append("<li><strong>" + msg.username + ":</strong> " + msg.message + "</li>");
    window.scrollTo(0, document.body.scrollHeight); //scrolls to the latest message
});

socket.on('system message', function(msg) {
    $('#messages').append("<li><em>" + msg.message + "</em></li>");
    window.scrollTo(0, document.body.scrollHeight); // Scroll to the latest message
});

socket.on('private message', function(msg) {
    $('#messages').append("<li><em>(Private) " + msg.from + ": " + msg.message + "</em></li>");
    window.scrollTo(0, document.body.scrollHeight); // Scroll to the latest message
});

// send private message on form submit for private messaging
$('#private-form').submit(function () {
    var message = $('#input-private').val();
    var friend = $('#friend').val(); // Get username

    if (message && friend) {
        // emit private message to the server
        socket.emit('private message', { message: message, friend: friend });
        $("#input-private").val("");  
    }
    return false;
});