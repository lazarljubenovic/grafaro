import {AbstractMessageStream} from './message-stream.abstract.model';
import {ReplaySubject} from 'rxjs';
import {ChatMessageInfo} from '../shared/chat/chat-message/chat-message.component';
import {Message} from '../message';
import {RoomInfoMessage} from '../project-browser/room-info.interface';
import {JoinMessageInfo} from '../project-browser/join.service';
import {GraphInfoMessage} from '../project-view/graph-socket.service';

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
const dummyRooms: RoomInfoMessage = {
    info: [
        {
            id: '123456',
            description: 'First dummy room',
            master: 'Kristo',
            name: 'Dummy room #1',
            userCount: 0
        },
        {
            id: '7890',
            description: 'Second dummy room',
            master: 'Hesus',
            name: `Hesus' room`,
            userCount: 0
        }
    ]
};
const dummyJoinMessage: JoinMessageInfo = {
    roomId: '123456',
    isMaster: true
};
const dummyGraph: GraphInfoMessage = {
    graph: {
        nodes: [
            {
                id: 'node-0',
                label: 'A',
                position: {x: 0, y: 0},
                weight: 1,
            },
            {
                id: 'node-1',
                label: 'B',
                position: {x: 100, y: 0},
                weight: 1,
            },
            {
                id: 'node-2',
                label: 'C',
                position: {x: 100, y: 100},
                weight: 1,
            },
            {
                id: 'node-3',
                label: 'D',
                position: {x: -100, y: 100},
                weight: 1,
            },
            {
                id: 'node-4',
                label: 'E',
                position: {x: -100, y: 200},
                weight: 1,
            },
        ],
        edges: [
            {
                id: 'edge-0',
                from: 'node-0',
                to: 'node-1',
                label: '1',
                weight: 1,
            },
            {
                id: 'edge-1',
                from: 'node-0',
                to: 'node-2',
                label: '2',
                weight: 2,
            },
            {
                id: 'edge-2',
                from: 'node-1',
                to: 'node-4',
                label: '4',
                weight: 4,
            },
            {
                id: 'edge-3',
                from: 'node-2',
                to: 'node-3',
                label: '1',
                weight: 1,
            },
            {
                id: 'edge-4',
                from: 'node-4',
                to: 'node-0',
                label: '2',
                weight: 2,
            },
        ],
        nextNodeId: 5,
        nextEdgeId: 5,
    },
    algorithm: {
        id: 'bfs',
        options: {
            root: 'node-0',
        },
    },
};

export class MockMessageStream extends AbstractMessageStream {
    public createStream(ws: WebSocket) {
        this._message$ = new ReplaySubject<Message<any>>();

        (<ReplaySubject<Message<any>>>this._message$).next({
            roomId: '',
            type: 'roomInfo',
            payload: dummyRooms
        });

        return this._message$;
    }

    public createChatMessages() {
        dummyMessages.forEach(message =>
            (<ReplaySubject<Message<any>>>this._message$).next({
                roomId: '123456',
                type: 'chat',
                payload: message
            }));
    }

    public returnJoin() {
        (<ReplaySubject<Message<any>>>this._message$).next({
            roomId: '123456',
            payload: dummyJoinMessage,
            type: 'join'
        });
    }

    public createGraph() {
        (<ReplaySubject<Message<any>>>this._message$).next({
            roomId: '123456',
            payload: dummyGraph,
            type: 'graph'
        });
    }

    constructor(ws: WebSocket) {
        super(ws);
        console.log('~~~Creating mock stream~~~');
    }
}
