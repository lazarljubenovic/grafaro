import {ChatMessageInfo, Message} from './interfaces';
import * as http from 'http';
import * as ws from 'ws';
import * as express from 'express';

const server = http.createServer();
const WebSocketServer = ws.Server;
const wss = new WebSocketServer({server: server});
const app = express();
const port = 4000;

const dummyMessages: ChatMessageInfo[] = [
    {
        timeStamp: new Date(),
        senderHandle: `lazarljubenovic`,
        senderName: `Lazar Ljubenović`,
        senderHash: `ff8adece0631821959f443c9d956fc39`,
        message: `Hello World!`,
    },
    {
        timeStamp: new Date(),
        senderHandle: `pritilender`,
        senderName: `Mihajlo Ilijić`,
        senderHash: `ff8adece0631821959f443c9d956fc39`,
        message: `Hello World! **bold** _italic_ ~~strike~~`,
    },
    {
        timeStamp: new Date(),
        senderHandle: `lazarljubenovic`,
        senderName: `Lazar Ljubenović`,
        senderHash: `ff8adece0631821959f443c9d956fc39`,
        message: `Hello World! [link](www.google.com)`,
    },
    {
        timeStamp: new Date(),
        senderHandle: `pritilender`,
        senderName: `Mihajlo Ilijić`,
        senderHash: `ff8adece0631821959f443c9d956fc39`,
        message: `Hello World! :) :* ;) :(`,
    },
    {
        timeStamp: new Date(),
        senderHandle: `lazarljubenovic`,
        senderName: `Lazar Ljubenović`,
        senderHash: `ff8adece0631821959f443c9d956fc39`,
        message: `Hello World! :joy: :heart: :sob: :+1:`,
    },
];

let messageRooms = {}; // associative array where each member holds an array of websocket clients

app.use(function (req, res) {
    res.send({msg: 'hello'});
});

wss.on('connection', ws => {
    // let location = url.parse(ws.upgradeReq.url, true);

    ws.on('message', (message: string) => {
        let messageObj: Message<any> = JSON.parse(message);

        if (messageObj.type == 'chat') {
            var parsedMessage: ChatMessageInfo = messageObj.payload; // todo fix type
        }
        console.log(parsedMessage);

        // Create room if it doesn't exists
        if (messageRooms[parsedMessage.senderHash] == undefined) {
            messageRooms[parsedMessage.senderHash] = [];
        }


        if (parsedMessage.message == 'init') {
            // Add user if the message is "init"
            // todo should have special type for init messages
            messageRooms[parsedMessage.senderHash].push(ws);
            console.log('New user joined the room', parsedMessage.senderHash);
        } else {
            // Broadcast message to other users in the same room
            wss.clients.filter(client => {
                return (messageRooms[parsedMessage.senderHash].indexOf(client) > -1)
                    && client != ws;
            })
                .forEach(client => client.send(JSON.stringify(messageObj)));
        }
    });

    ws.on('error', (error) => {
        console.log(error);
    });

    ws.on('close', () => {
        let rooms = Object.keys(messageRooms);
        rooms.forEach(room => {
            let ind = messageRooms[room].indexOf(ws);

            if (ind > -1) {
                messageRooms[room].splice(ind, 1);
                console.log('User has left the room', room);
            }
        });
    });

    setTimeout(() => {
        dummyMessages.forEach(dummyMessage => {
            ws.send(JSON.stringify({
                payload: dummyMessage,
                type: 'chat'
            }));
        });
    }, 1000);
});

server.on('request', app);
server.listen(port, () => {
    console.log('Listening on ' + server.address().port);
});
