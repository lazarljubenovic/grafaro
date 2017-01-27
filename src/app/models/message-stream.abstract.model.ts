import {Message} from '../message';
import {Observable} from 'rxjs';

export abstract class AbstractMessageStream {
    protected _message$: Observable<Message<any>>;
    public get message$(): Observable<Message<any>> {
        return this._message$;
    }

    public constructor(ws: WebSocket) {
        this._message$ = this.createStream(ws);
    }

    protected abstract createStream(ws: WebSocket): Observable<Message<any>>;
}
