import {ChatMessageInfo, Message, JoinMessage, defaultGraph} from './interfaces';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as ws from 'ws';
import * as express from 'express';
import * as url from 'url';
import * as mongoose from 'mongoose';
import * as cors from 'cors';
import {dbRoutes} from './routes';
import {MessageRoom} from './messageRoom.model';

const server = http.createServer();
const WebSocketServer = ws.Server;
const wss = new WebSocketServer({server: server});
const app = express();
const port = 4000;

mongoose.connect('mongodb://admin:admin@ds139198.mlab.com:39198/grafaro');

const db = mongoose.connection;

db.on('error', (error) => console.log('Connection error: ', error));

db.once('open', () => console.log('Connected'));

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

let messageRooms: MessageRoom = MessageRoom.getInstance();
let lobby: ws[] = [];


app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use('/', dbRoutes);

wss.on('connection', ws => {
    console.log('New user');

    lobby.push(ws);
    messageRooms.sendRoomsInfo(ws);
    console.log('Users in lobby:', lobby.length);

    ws.on('message', (message: string) => {
        let messageObj: Message<any> = JSON.parse(message);
        let roomId = messageObj.roomId;

        if (messageObj.type == 'create') {
            const roomId = messageRooms.createNewRoom();
            const joinMessage: Message<JoinMessage> = {
                type: 'join',
                payload: {roomId},
                roomId
            };
            messageRooms.returnMessage(ws, joinMessage);
        } else if (messageObj.type == 'join') {
            if (!messageRooms.hasRoom(roomId)) {
                // Create new room if it doesn't exist
                console.log('No such room', roomId);
            }

            let lobbyInd = lobby.findIndex(client => client == ws);
            messageRooms.addUserToRoom(roomId, ws);
            lobby.splice(lobbyInd, 1);
            (<JoinMessage>messageObj.payload).roomId = roomId;
            messageRooms.returnMessage(ws, messageObj);

            // Update room list
            lobby.forEach(client => messageRooms.sendRoomsInfo(client));
        } else {
            console.log(messageObj, 'to room', roomId);
            // Broadcast message to other users in the same room
            messageRooms.sendMessageToRoom(roomId, ws, messageObj);
        }
    });

    ws.on('error', (error) => {
        console.log(error);
    });

    ws.on('close', () => {
        let lobbyInd = lobby.findIndex(client => client == ws);
        let userRoom = messageRooms.userHasRoom(ws);

        if (!!userRoom) {
            messageRooms.removeUserFromRoom(userRoom, ws);
            if (messageRooms.getRoomUserCount(userRoom) == 0) {
                messageRooms.deleteRoom(userRoom);
                console.log('Room', userRoom, 'is deleted.');
            }
            lobby.forEach(client => messageRooms.sendRoomsInfo(client));
        } else if (lobbyInd > -1) {
            lobby.splice(lobbyInd, 1);
        }
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
