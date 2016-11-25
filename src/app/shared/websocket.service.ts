import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs/Rx";
import {Message} from "../message";

@Injectable()
export class WebSocketService {
    private wsSubject: Subject<any>; //todo type

    public send(message: any, type: string) {
        this.wsSubject.next({
            payload: message,
            type: type
        });
    }

    public create(url: string): Observable<Message<any>> {
        this.wsSubject = Observable.webSocket(url);

        return this.wsSubject;
    }

    constructor() {
    }

}
