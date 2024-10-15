import http from 'http'
import {server as WebSocketServer} from 'websocket'

let connection = null;
// const http = require('http');
// const webSocketServer = require('websocket');

const httpServer = http.createServer();
httpServer.listen(8888, ()=> console.log('listeing on 8888'))

const wsServer = new WebSocketServer({
    "httpServer": httpServer
})

wsServer.on("request", request => {
    //connect
    connection = request.accept(null, request.origin);
    connection.on("open", ()=> console.log('opened!'));
    connection.on("close", ()=> console.log('closed!'));
    connection.on("message", message => {

        //I have recieved a message from the client
        console.log(`Recieved: ${message.utf8Data}`);


    })

    sendevery5seconds();

})

function sendevery5seconds(){

    connection.send(`Message ${Math.random()}`);

    setTimeout(sendevery5seconds, 5000);


}