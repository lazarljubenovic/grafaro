import {Injectable} from '@angular/core';
import {WebSocketService} from '../websocket.service';
import {Observable} from 'rxjs';

export interface JoinMessageInfo {
    roomId: string;
    error: string;
}

@Injectable()
export class JoinSocketService {
    public joinSocket$: Observable<JoinMessageInfo>;

    constructor(private webSocketService: WebSocketService) {
        this.joinSocket$ = this.webSocketService.subscribeTo('join');
    }

    public newRoom(): void {
        this.webSocketService.send({}, 'create');
    }

    public joinRoom(id: string): void {
        this.webSocketService.send({roomId: id}, 'join');
    }

    public setRoom(id: string): void {
        this.webSocketService.roomId = id;
    }

}
