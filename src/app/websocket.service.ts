import {ReplaySubject, Observable} from 'rxjs/Rx';
import {Message} from './message';

export class WebSocketService {
    private ws: WebSocket;
    private messages: ReplaySubject<Message<any>>;
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
        }
    }

    private connect(url: string): void {
        this.ws = new WebSocket(url);
        this.ws.onopen = (event) => {
            console.log('Socket open');
            this.createStream(this.ws).subscribe(message => {
                this.messages.next(message);
            });
            this.socketStatus.next(true);
            this.messageBuffer.forEach(message => {
                console.log('sending', message);
                this.ws.send(JSON.stringify(message));
            });
            this.messageBuffer = [];
        };
        this.ws.onclose = (event) => {
            console.log('Socket closed');
            this.socketStatus.next(false);
        };
        this.ws.onerror = (event) => {
            console.log('Socket error');
        };
    }

    private createStream(ws: WebSocket) {
        return Observable.fromEvent(ws, 'message')
            .map((message: MessageEvent) => JSON.parse(message.data));
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
