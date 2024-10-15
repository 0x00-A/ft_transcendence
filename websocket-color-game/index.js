import http from 'http';
import { server as WebSocketServer } from 'websocket';

// Create an HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(404);
    res.end();
});

server.listen(8888, () => {
    console.log('Listening on port 8888');
});

// Create a global array for WebSocket connections
global.connections = [];

const wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', function (request) {
    // Accept the WebSocket connection
    const connection = request.accept(null, request.origin);
    console.log('Client connected');

    // Push the connection into the global array
    global.connections.push(connection);

    // Send an initial message to the client
    connection.sendUTF('Hello, Client!');

    // When the client sends a message
    connection.on('message', function (message) {
        console.log(`Received message${connections.length}:`, message.utf8Data);
    });

    // Handle connection close
    connection.on('close', function () {
        console.log('Client disconnected');
        // Remove the connection from the array when disconnected
        const index = global.connections.indexOf(connection);
        if (index > -1) {
            global.connections.splice(index, 1);
        }
    });
});
