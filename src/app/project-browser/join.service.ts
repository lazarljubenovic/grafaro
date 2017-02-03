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
        let stream = this.webSocketService.subscribeTo('join');
        stream.subscribe((message: JoinMessageInfo) => {
            this.isMaster = message.isMaster;
        });
        return stream;
    }

    public newRoom(): void {
        this.webSocketService.send({}, 'create');
    }

    public joinRoom(id: string): void {
        this.webSocketService.roomId = id;
        this.webSocketService.send({id}, 'join');
    }

}
