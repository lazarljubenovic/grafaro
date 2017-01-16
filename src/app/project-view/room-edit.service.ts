import {Injectable, Inject} from '@angular/core';
import {WebSocketService} from '../core/websocket.service';
import {Subject} from 'rxjs';

interface RoomEditMessage {
    name: string;
    description: string;
}

@Injectable()
export class RoomEditService {
    public name$: Subject<string> = new Subject<string>();
    public description$: Subject<string> = new Subject<string>();

    // todo change socket services to something more nicer like this
    constructor(@Inject(WebSocketService) private webSocket) {
        this.webSocket.getSubscriber('roomEdit').subscribe(roomEdit => {
            console.log('subs', roomEdit);
            this.name$.next(roomEdit.name);
            this.description$.next(roomEdit.description);
        });
    }

    public update(data: RoomEditMessage): void {
        this.webSocket.send(data, 'roomEdit');
    }
}
