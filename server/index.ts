import {ChatMessageInfo, Message, JoinMessage} from './interfaces';
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

app.use('/room', (req, res) => {
    const userId = req.body['id'];
    const roomId = messageRooms.createNewRoom();
    messageRooms.addUserToRoom(roomId, userId);

    res.send({data: roomId});
});

wss.on('connection', ws => {
    let location = url.parse(ws.upgradeReq.url, true);
    const userRoom: string = location.path.slice(1);
    console.log('New user');

    lobby.push(ws);
    messageRooms.sendRoomsInfo(ws);
    console.log(lobby.length);

    ws.on('message', (message: string) => {
        let messageObj: Message<any> = JSON.parse(message);

        if (messageObj.type == 'join') {
            const messagePayload = <JoinMessage>messageObj.payload;
            let roomId = messagePayload.roomId;

            if (!messageRooms.hasRoom(roomId)) {
                // Create new room if it doesn't exist
                roomId = messageRooms.createNewRoom();
            }

            let lobbyInd = lobby.findIndex(client => client == ws);
            messageRooms.addUserToRoom(roomId, ws);
            lobby.splice(lobbyInd, 1);
            (<JoinMessage>messageObj.payload).roomId = roomId;
            messageRooms.returnMessage(ws, messageObj);

            // Update room list
            lobby.forEach(client => messageRooms.sendRoomsInfo(client));
        } else {
            console.log(messageObj, 'to room', userRoom);
            // Broadcast message to other users in the same room
            messageRooms.sendMessageToRoom(userRoom, ws, messageObj);
        }
    });

    ws.on('error', (error) => {
        console.log(error);
    });

    ws.on('close', () => {
        let lobbyInd = lobby.findIndex(client => client == ws);

        if (messageRooms.userHasRoom(ws)) {
            messageRooms.removeUserFromRoom(userRoom, ws);
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
