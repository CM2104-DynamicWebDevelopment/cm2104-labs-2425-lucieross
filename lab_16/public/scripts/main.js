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

socket.on('chat message', function(msg) { //adds message to the message list
    $('#messages').append("<li>"+msg+"</li>");
    window.scrollTo(0, document.body.scrollHeight);
});