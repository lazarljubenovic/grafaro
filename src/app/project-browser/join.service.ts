import {Injectable, Inject} from '@angular/core';
import {WebSocketService} from '../websocket.service';
import {Observable} from 'rxjs';

export interface JoinMessageInfo {
    roomId: string;
    isMaster: boolean;
}

@Injectable()
export class JoinService {
    // todo factory? or something?
    // private joinSubject: Observable<JoinMessageInfo>;
    public isMaster = false;

    constructor(@Inject(WebSocketService) private webSocketService: WebSocketService) {
    }

    public create(): Observable<JoinMessageInfo> {
        console.log('Join Ovde?');
        return this.webSocketService.subscribeTo('join');
    }

    public newRoom(): void {
        this.webSocketService.send({}, 'create');
    }

    public joinRoom(id: string): void {
        this.webSocketService.roomId = id;
        this.webSocketService.send({id}, 'join');
    }

}
