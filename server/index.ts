import {ChatMessageInfo, Message, JoinMessage, GraphMessage, AlgorithmMessage} from './interfaces';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as ws from 'ws';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as cors from 'cors';
import {databaseRoutes} from './routes';
import {MessageRoom} from './messageRoom.model';

const server = http.createServer();
const WebSocketServer = ws.Server;
const wss = new WebSocketServer({server: server});
const app = express();
const port = 4000;

mongoose.connect('mongodb://admin:grafaroAdmin@ds025973.mlab.com:25973/grafaro');

const db = mongoose.connection;

db.on('error', (error) => console.log('Connection error: ', error));

db.once('open', () => console.log('Connected to DB'));

const dummyMessages: ChatMessageInfo[] = [
    {
        timeStamp: new Date(),
        senderName: `Lazar Ljubenović`,
        message: `Hello World from server side!!`,
    },
    {
        timeStamp: new Date(),
        senderName: `Mihajlo Ilijić`,
        message: `Hello World! **bold** _italic_ ~~strike~~`,
    },
    {
        timeStamp: new Date(),
        senderName: `Lazar Ljubenović`,
        message: `Hello World! [link](www.google.com)`,
    },
    {
        timeStamp: new Date(),
        senderName: `Mihajlo Ilijić`,
        message: `Hello World from priti side! :) :* ;) :(`,
    },
    {
        timeStamp: new Date(),
        senderName: `Lazar Ljubenović`,
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

app.use('/', databaseRoutes);

wss.on('connection', ws => {
    console.log('New user');

    lobby.push(ws);
    messageRooms.sendRoomsInfo(ws);
    console.log('Users in lobby:', lobby.length);

    ws.on('message', (message: string) => {
        let messageObj: Message<any> = JSON.parse(message);
        let roomId = messageObj.roomId;
        console.log('message', messageObj);

        switch (messageObj.type) {
            case 'create':
                roomId = messageRooms.createNewRoom();
                messageRooms.sendJoinMessage(ws, roomId);
                lobby.forEach(user => messageRooms.sendRoomsInfo(user));
                break;
            case 'join':
                try {
                    console.log('Join sector');
                    roomId = (<JoinMessage>messageObj.payload).roomId;
                    messageRooms.addUserToRoom(roomId, ws);
                    messageRooms.sendMasterMessage(ws, roomId);
                    let lobbyIndex = lobby.findIndex(user => ws == user);
                    lobby.splice(lobbyIndex, 1);
                    lobby.forEach(user => messageRooms.sendRoomsInfo(user));

                    // Send dummy chat messages
                    dummyMessages.forEach(dummyMessage => {
                        ws.send(JSON.stringify({
                            payload: dummyMessage,
                            type: 'chat'
                        }));
                    });
                } catch (exception) {
                    messageRooms.sendJoinMessage(ws, roomId, `No room ${roomId} found!`);
                }
                break;
            case 'roomEdit':
                let roomEdit = messageObj.payload;
                messageRooms.setRoomEdit(roomId, roomEdit);
                messageRooms.sendMessageToRoom(roomId, ws, messageObj);
                lobby.forEach(user => messageRooms.sendRoomsInfo(user));
                break;
            case 'graph':
                let graphMessage: GraphMessage = messageObj.payload;
                messageRooms.setRoomGraph(roomId, graphMessage.graph);
                messageRooms.sendMessageToRoom(roomId, ws, messageObj);
                break;
            case 'algorithm':
                let algorithmMessage: AlgorithmMessage = messageObj.payload;
                messageRooms.setRoomAlgorithm(roomId, algorithmMessage);
                messageRooms.sendMessageToRoom(roomId, ws, messageObj);
                break;
            case 'state':
                let stateIndex: number = messageObj.payload;
                messageRooms.setRoomState(stateIndex, roomId);
                messageRooms.sendMessageToRoom(roomId, ws, messageObj);
                break;
            case 'chat':
                messageRooms.sendMessageToRoom(roomId, ws, messageObj);
                break;
            default:
                console.log('TODO: New type?', messageObj.type);
                break;
        }
    });

    ws.on('error', (error) => {
        console.log(error);
    });

    ws.on('close', () => {
        let lobbyIndex = lobby.findIndex(client => client == ws);
        let userRoom = messageRooms.userHasRoom(ws);

        if (lobbyIndex > -1) {
            // User was in lobby, just remove it from lobby
            lobby.splice(lobbyIndex, 1);
        } else {
            messageRooms.removeUserFromRoom(userRoom, ws);
            lobby.forEach(user => messageRooms.sendRoomsInfo(user));
        }
    });
});

server.on('request', app);
server.listen(port, () => {
    console.log('Listening on ' + server.address().port);
});
