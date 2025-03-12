const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let users = {}; // Store users with their socket IDs

// Serve static files from the "public" folder
app.use(express.static('public'));

// Set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('pages/index');
});

io.on('connection', function (socket) {
    console.log('a user connected');

    // Track users by their socket ID
    socket.on('join room', function (data) {
        users[socket.id] = data.username;
        console.log(`${data.username} has joined room: ${data.room}`);

        // Join the room
        socket.join(data.room);
        
        // Emit a system message to the room
        io.to(data.room).emit('system message', {
            message: `${data.username} has joined the room: ${data.room}`
        });
    });

    // Handles incoming chat messages
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg); // message to everyone
    });

    // Handle room leaving
    socket.on('leave room', function (data) {
        socket.leave(data.room);
        console.log(`${users[socket.id]} has left room: ${data.room}`);
    });

    // Handle user disconnecting
    socket.on('disconnect', function () {
        console.log('user disconnected');
        // Clean up the users list when they disconnect
        delete users[socket.id];
    });
});

// Start the server
http.listen(8080, function () {
    console.log('listening on: 8080');
});
