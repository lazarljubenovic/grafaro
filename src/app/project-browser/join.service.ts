import {Injectable, Inject} from '@angular/core';
import {WebSocketService} from '../core/websocket.service';
import {Observable} from 'rxjs';
import {Message} from '../message';

export interface JoinMessageInfo {
    roomId: string;
}

@Injectable()
export class JoinService {
    // todo factory? or something?
    private joinSubject: Observable<JoinMessageInfo>;

    constructor(@Inject(WebSocketService) private webSocketService: WebSocketService) {
    }

    public create(): Observable<JoinMessageInfo> {
        this.joinSubject = this.webSocketService.getWebSocket()
            .filter((msg: Message<JoinMessageInfo>) => msg.type == 'join')
            .map((msg: Message<JoinMessageInfo>) => {
                return msg.payload;
            });

        return this.joinSubject;
    }

    public newRoom(): void {
        this.webSocketService.send({}, 'create');
    }

    public joinRoom(id: string): void {
        this.webSocketService.roomId = id;
        this.webSocketService.send({id}, 'join');
    }

}
