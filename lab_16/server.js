const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Serve static files from the "public" folder
app.use(express.static('public'));

// Set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('pages/index');
});

io.on('connection', function (socket) {
    console.log('a user connected');

    // Handles joining a room
    socket.on('join room', function (data) {
        // Joins the specified room
        socket.join(data.room);
        console.log(`${data.username} has joined room: ${data.room}`);
        
        // Emit a system message to the room
        io.to(data.room).emit('system message', {
            message: `${data.username} has joined the room: ${data.room}`
        });
    });


    // Handles incoming chat messages
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg); // message to everyone
    });

    // Handle user disconnecting
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

// Start the server
http.listen(8080, function () {
    console.log('listening on: 8080');
});
