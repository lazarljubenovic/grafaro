import {AbstractMessageStream} from './message-stream.abstract.model';
import {ReplaySubject} from 'rxjs';
import {ChatMessageInfo} from '../shared/chat/chat-message/chat-message.component';
import {Message} from '../message';
import {RoomInfoMessage} from '../project-browser/room-info.interface';
import {JoinMessageInfo} from '../project-browser/join.service';

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

    constructor(ws: WebSocket) {
        super(ws);
        console.log('~~~Creating mock stream~~~');
    }
}
