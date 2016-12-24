import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import {Message} from '../message';

@Injectable()
export class WebSocketService {
    private wsSubject: Subject<any>; // todo type

    public send(message: any, type: string) {
        let messageToSend: Message<any> = {
            payload: message,
            type: type
        };

        this.wsSubject.next(JSON.stringify(messageToSend));
    }

    public create(url: string): Observable<Message<any>> {
        this.wsSubject = Observable.webSocket(url);

        return this.wsSubject;
    }

    public getWebSocket(): Observable<Message<any>> {
        return this.wsSubject;
    }

    constructor() {
    }

}