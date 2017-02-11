import {Injectable, Inject} from '@angular/core';
import {WebSocketService} from '../websocket.service';
import {Observable} from 'rxjs';
import {RoomInfoMessage} from './room-info.interface';

@Injectable()
export class RoomInfoSocketService {
    public roomInfo$: Observable<RoomInfoMessage>;

    constructor(@Inject(WebSocketService) private webSocketService: WebSocketService) {
        this.roomInfo$ = this.webSocketService.subscribeTo('roomInfo');
    }

}
