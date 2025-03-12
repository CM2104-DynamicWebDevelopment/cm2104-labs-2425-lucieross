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

// Store connected users
let users = {};

io.on('connection', function (socket) {
    console.log('a user connected');

    // Handle user joining a room
    socket.on('join room', function (data) {
        socket.username = data.username;
        users[socket.id] = data.username;  // Store the user and their socket ID
        socket.join(data.room);
        console.log(`${data.username} has joined room: ${data.room}`);
        
        // Emit a system message to the room
        io.to(data.room).emit('system message', {
            message: `${data.username} has joined the room: ${data.room}`
        });
    });

    // Handle chat messages
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg); // Broadcast to everyone in the room
    });

    // Handle private messages
    socket.on('private message', function (data) {
        const recipientSocket = Object.keys(users).find(
            (socketId) => users[socketId] === data.recipient
        );

        if (recipientSocket) {
            // Send a private message to the recipient
            io.to(recipientSocket).emit('private message', {
                sender: socket.username,
                message: data.message
            });
        } else {
            socket.emit('system message', {
                message: `User ${data.recipient} not found.`
            });
        }
    });

    // Handle user disconnecting
    socket.on('disconnect', function () {
        console.log('user disconnected');
        delete users[socket.id];  // Remove user from the list when they disconnect
    });
});

// Start the server
http.listen(8080, function () {
    console.log('listening on: 8080');
});
