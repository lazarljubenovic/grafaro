import {ReplaySubject, Observable} from 'rxjs/Rx';
import {Message} from './message';
import {MockMessageStream} from './models/message-stream.mock.model';
import {MessageStream} from './models/message-stream.model';
import {AbstractMessageStream} from './models/message-stream.abstract.model';

export class WebSocketService {
    private ws: WebSocket;
    private messages: ReplaySubject<Message<any>>;
    private stream: AbstractMessageStream;
    private _roomId: string = '';
    public set roomId(value: string) {
        this._roomId = value;
    }

    public constructor() {
        this.messages = new ReplaySubject<Message<any>>(5);
    }

    public send(message: any, type: string) {
        let messageToSend: Message<any> = {
            payload: message,
            type: type,
            roomId: this._roomId
        };

        if (this.ws.readyState == WebSocket.OPEN) {
            this.ws.send(JSON.stringify(messageToSend));
        } else {
            (<MockMessageStream>this.stream).createChatMessages();
        }
    }

    public connect(url: string): ReplaySubject<Message<any>> {
        this.ws = new WebSocket(url);
        this.ws.onopen = (event) => {
            console.log('Socket open');
            this.stream = new MessageStream(this.ws);
            this.stream.message$.subscribe(message => this.messages.next(message));
        };
        this.ws.onclose = (event) => {
            console.log('Socket closed');
            this.stream.message$.subscribe(message => this.messages.next(message));
        };
        this.ws.onerror = (event) => {
            console.log('Socket error');
        };
        this.stream = new MockMessageStream(this.ws);

        return this.messages;
    }

    public subscribeTo(type: string): Observable<any> {
        return this.messages.filter((msg: Message<any>) => msg.type == type)
            .map((msg: Message<any>) => {
                return msg.payload;
            });
    }
}
