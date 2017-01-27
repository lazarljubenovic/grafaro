import {AbstractMessageStream} from './message-stream.abstract.model';
import {Observable} from 'rxjs';

export class MessageStream extends AbstractMessageStream {
    public createStream(ws: WebSocket) {
        return Observable.fromEvent(ws, 'message')
            .map((message: MessageEvent) => JSON.parse(message.data));
    }

    public constructor(ws: WebSocket) {
        super(ws);
    }
}
