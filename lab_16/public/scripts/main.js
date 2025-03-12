var socket = io();
var roomJoined = false;
var currentRoom = null;

// On form submit, send a message
$('#form').submit(function () {
    var message = $('#input').val(); //message
    var username = $('#username').val(); //username
    var room = $('#room').val(); //room
    var recipient = $('#recipient').val(); //friend user

    if (message && username && room) {
        if (room !== currentRoom) {
            if (currentRoom) {
                socket.emit('leave room', { room: currentRoom });
                console.log('User left room:', currentRoom);
            }
            socket.emit('join room', { room: room, username: username });
            currentRoom = room;
            roomJoined = true;
        }

        if (recipient) {
            // send a private message
            socket.emit('private message', {
                recipient: recipient,
                message: message
            });
        } else {
            socket.emit('chat message', { username: username, message: message });
        }

        $("#input").val("");
    }
    return false;
});

// Display chat messages
socket.on('chat message', function (msg) {
    $('#messages').append("<li><strong>" + msg.username + ":</strong> " + msg.message + "</li>");
    window.scrollTo(0, document.body.scrollHeight);
});

// Display private messages
socket.on('private message', function (msg) {
    $('#messages').append("<li><strong>Private from " + msg.sender + ":</strong> " + msg.message + "</li>");
    window.scrollTo(0, document.body.scrollHeight);
});

// Display system messages
socket.on('system message', function (msg) {
    $('#messages').append("<li><em>" + msg.message + "</em></li>");
    window.scrollTo(0, document.body.scrollHeight);
});
