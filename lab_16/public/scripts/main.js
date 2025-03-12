var socket = io();

//On form submit gets the context and emits a chat message
$('#form').submit(function () {
    var message = $('#input').val();
    if (message) {
    socket.emit('chat message', message);
    $("#input").val("");
    }
    return false;
})