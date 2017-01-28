import {AbstractMessageStream} from './message-stream.abstract.model';
import {ReplaySubject} from 'rxjs';
import {ChatMessageInfo} from '../shared/chat/chat-message/chat-message.component';
import {Message} from '../message';

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

export class MockMessageStream extends AbstractMessageStream {
    public createStream(ws: WebSocket) {
        this._message$ = new ReplaySubject<Message<any>>();
        dummyMessages.forEach(message =>
            (<ReplaySubject<Message<any>>>this._message$).next({
                roomId: '1111',
                type: 'chat',
                payload: message
            }));
        return this._message$;
    }

    constructor(ws: WebSocket) {
        super(ws);
        console.log('~~~Creating mock stream~~~');
    }
}
