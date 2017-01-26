import {Injectable} from '@angular/core';
import {Observable, Subject, Observer} from 'rxjs/Rx';
import {Message} from '../message';

@Injectable()
export class WebSocketService {

    private wsSubject: Subject<any>; // todo type
    private _roomId: string = '';
    public set roomId(value: string) {
        this._roomId = value;
    }

    public send(message: any, type: string) {
        let messageToSend: Message<any> = {
            payload: message,
            type: type,
            roomId: this._roomId
        };

        this.wsSubject.next(JSON.stringify(messageToSend));
    }

    public create(url: string): Observable<Message<any>> {
        let ws = new WebSocket(url);

        let observable = Observable.create(
            (obs: Observer<any>) => {
                ws.onmessage = obs.next.bind(obs);
                ws.onerror = obs.error.bind(obs);
                ws.onclose = obs.complete.bind(obs);

                return ws.close.bind(ws);
            }
        );

        let observer = {
            next: (data: any) => {
                if (ws.readyState == WebSocket.OPEN) {
                    ws.send(JSON.stringify(data));
                }
            }
        };
        this.wsSubject = Subject.create(observer, observable);
        return this.wsSubject;
        // this.wsSubject = Observable.webSocket(url);
        //
        // return this.wsSubject;
    }

    public getWebSocket(): Observable<Message<any>> {
        return this.wsSubject;
    }

    public getSubscriber(type: string): Observable<any> {
        return this.wsSubject.filter((msg: Message<any>) => msg.type == type)
            .map((msg: Message<any>) => {
                return msg.payload;
            });
    }

    constructor() {
    }

}
