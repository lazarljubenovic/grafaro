import {Injectable, Inject} from '@angular/core';
import {WebSocketService} from '../websocket.service';
import {Subject} from 'rxjs';

interface RoomEditMessage {
    name: string;
    description: string;
}

@Injectable()
export class RoomEditService {
    public name$: Subject<string> = new Subject<string>();
    public description$: Subject<string> = new Subject<string>();

    constructor(@Inject(WebSocketService) private webSocket: WebSocketService) {
        this.webSocket.subscribeTo('roomEdit').subscribe(roomEdit => {
            this.name$.next(roomEdit.name);
            this.description$.next(roomEdit.description);
        });
    }

    public update(data: RoomEditMessage): void {
        this.webSocket.send(data, 'roomEdit');
    }
}
