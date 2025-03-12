var socket = io();

//On form submit gets the context and emits a chat message
$('#form').submit(function () {
    var message = $('#input').val();
    var username = $('#username').val(); 
    var room = $('#room').val();


    if (message && username && room) {
        socket.emit('join room', { room: room, username: username });
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