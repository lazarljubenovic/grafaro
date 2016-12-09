import {ChatMessageInfo, Message} from "./interfaces";
import * as http from "http";
import * as ws from "ws";
import * as express from "express";
import * as url from "url";

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

let messageRooms: Map<string, Set<ws>> = new Map();

app.use(function (req, res) {
    res.send({msg: 'hello'});
});

wss.on('connection', ws => {
    let location = url.parse(ws.upgradeReq.url, true);
    const userRoom: string = location.path.slice(1);
    console.log('New user');

    if (userRoom == '') {
        // No user hash, send new one
        ws.send(JSON.stringify({hash: "1231"}));
    }

    // Create room if it doesn't exists
    if (!messageRooms.has(userRoom)) {
        messageRooms.set(userRoom, new Set());
    }

    // Add user to the room
    messageRooms.get(userRoom).add(ws);
    console.log('New user joined the room', userRoom);

    ws.on('message', (message: string) => {
        let messageObj: Message<any> = JSON.parse(message);

        console.log(messageObj, "to room", userRoom);

        // Broadcast message to other users in the same room
        messageRooms.get(userRoom)
            .forEach(client => client != ws && client.send(JSON.stringify(messageObj)));
    });

    ws.on('error', (error) => {
        console.log(error);
    });

    ws.on('close', () => {
        messageRooms.get(userRoom)
            .delete(ws);
        console.log('User has left the room', userRoom);
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
