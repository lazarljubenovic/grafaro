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

    private messageBuffer: Message<any>[] = [];

    public socketStatus = new ReplaySubject<boolean>(1); // true if WebSocket.OPEN

    public constructor() {
        this.messages = new ReplaySubject<Message<any>>(5);
    }

    public send(message: any, type: string) {
        let messageToSend: Message<any> = {
            payload: message,
            type: type,
            roomId: this._roomId
        };

        if (this.ws.readyState == WebSocket.CONNECTING) {
            this.messageBuffer.push(messageToSend);
        } else if (this.ws.readyState == WebSocket.OPEN) {
            this.ws.send(JSON.stringify(messageToSend));
        } else if (type == 'join') {
            // (<MockMessageStream>this.stream).createChatMessages();
            (<MockMessageStream>this.stream).returnJoin();
            (<MockMessageStream>this.stream).createGraph();
        }
    }

    private connect(url: string): void {
        this.ws = new WebSocket(url);
        this.ws.onopen = (event) => {
            console.log('Socket open');
            this.socketStatus.next(true);
            this.messageBuffer.forEach(message => {
                console.log('sending', message);
                this.ws.send(JSON.stringify(message));
            });
            this.messageBuffer = [];
            this.stream = new MessageStream(this.ws);
            this.stream.message$.subscribe(message => this.messages.next(message));
        };
        this.ws.onclose = (event) => {
            console.log('Socket closed');
            this.socketStatus.next(false);
            this.messageBuffer.forEach(message => {
                this.send(message, message.type);
            });
            this.stream.message$.subscribe(message => this.messages.next(message));
        };
        this.ws.onerror = (event) => {
            console.log('Socket error');
        };
        this.stream = new MockMessageStream(this.ws);
    }

    public subscribeTo(type: string): Observable<any> {
        if (this.ws == null) {
            this.connect('ws://localhost:4000');
        }
        return this.messages.filter((msg: Message<any>) => msg.type == type)
            .map((msg: Message<any>) => {
                return msg.payload;
            });
    }
}
