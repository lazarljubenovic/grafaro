import {Injectable, Inject} from '@angular/core';
import {WebSocketService} from '../websocket.service';
import {Observable} from 'rxjs';
import {RoomInfoMessage} from './room-info.interface';

@Injectable()
export class RoomInfoService {
    //  private roomInfoSubject: Observable<RoomInfoMessage>;

    constructor(@Inject(WebSocketService) private webSocketService: WebSocketService) {
    }

    public create(): Observable<RoomInfoMessage> {
        return this.webSocketService.subscribeTo('roomInfo');
    }

}
