import {ReplaySubject, Observable} from 'rxjs/Rx';
import {Message} from './message';
import {MockMessageStream} from './models/message-stream.mock.model';
import {MessageStream} from './models/message-stream.model';

export class WebSocketService {
    private ws: WebSocket;
    private messages: ReplaySubject<Message<any>>;
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
        }
    }

    public connect(url: string): ReplaySubject<Message<any>> {
        this.ws = new WebSocket(url);
        this.ws.onopen = (event) => {
            console.log('Socket open');
            let stream = new MessageStream(this.ws);
            stream.message$.subscribe(message => this.messages.next(message.payload));
        };
        this.ws.onclose = (event) => {
            console.log('Socket closed');
            let stream = new MockMessageStream(this.ws);
            stream.message$.subscribe(message => this.messages.next(message));
        };
        this.ws.onerror = (event) => {
            console.log('Socket error');
        };

        return this.messages;
    }

    public subscribeTo(type: string): Observable<Message<any>> {
        return this.messages.filter((msg: Message<any>) => msg.type == type)
            .map((msg: Message<any>) => {
                return msg.payload;
            });
    }
}
