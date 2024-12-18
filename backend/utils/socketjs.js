const { Server } = require("socket.io");

// New Web Socket server
const io = new Server({
    cors: {
        origin: true,
        methods: ["GET", "POST","PUT"]
    }
});

// Declaring socket to take the same event from io
var Socket = {
    emit: function (event, data) {
        io.emit(event, data);
    },
};

// This is only for test purposes
io.on('connection', (socket) => {
    console.log('a user connected');
});

exports.Socket = Socket;
exports.io = io;
