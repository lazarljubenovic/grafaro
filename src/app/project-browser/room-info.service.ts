import {Injectable, Inject} from '@angular/core';
import {WebSocketService} from '../core/websocket.service';
import {Observable} from 'rxjs';
import {Message} from '../message';

export interface RoomInfo {
    roomId: string;
    userCount: number;
}

export interface RoomInfoMessage {
    info: RoomInfo[];
}

@Injectable()
export class RoomInfoService {
    private roomInfoSubject: Observable<RoomInfoMessage>;

    constructor(@Inject(WebSocketService) private webSocketService: WebSocketService) {
    }

    public create(): Observable<RoomInfoMessage> {
        this.roomInfoSubject = this.webSocketService.getWebSocket()
            .filter((msg: Message<RoomInfoMessage>) => msg.type == 'roomInfo')
            .map((msg: Message<RoomInfoMessage>) => {
                return msg.payload;
            });

        return this.roomInfoSubject;
    }

}
