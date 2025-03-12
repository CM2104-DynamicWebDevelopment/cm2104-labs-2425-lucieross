const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

//code to define the public "static" folder
app.use(express.static('public'))

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.render('pages/index');
});

io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('join room', function (data) {
        // join the room
        socket.join(data.room);
        console.log(`${data.username} has joined room: ${data.room}`);
    });

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('chat message', function (msg) { //deals with message
        io.emit('chat message', msg); //prints the message to the site
    });
});

http.listen(8080, function(){
    console.log('listening on :8080');
});