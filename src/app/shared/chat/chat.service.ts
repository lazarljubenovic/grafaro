import {Injectable, Inject} from '@angular/core';
import {WebSocketService} from '../../core/websocket.service';
import {ChatMessageInfo} from './chat-message/chat-message.component';
import {Observable} from 'rxjs';
import {Message} from '../../message';

@Injectable()
export class ChatService {
    private chatSubject: Observable<ChatMessageInfo>;
    public dummyMessages: ChatMessageInfo[] = [
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

    constructor(@Inject(WebSocketService) private webSocketService: WebSocketService) {
    }

    public create(): Observable<ChatMessageInfo> {
        this.chatSubject = this.webSocketService.getWebSocket()
            .filter((msg: Message<ChatMessageInfo>) => msg.type == 'chat')
            .map((msg: Message<ChatMessageInfo>) => {
                return msg.payload;
            });

        return this.chatSubject;
    }

    public send(chatMessage: ChatMessageInfo): void {
        this.webSocketService.send(chatMessage, 'chat');
    }

}
