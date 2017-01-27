import {Injectable, Inject} from '@angular/core';
import {WebSocketService} from '../websocket.service';
import {Observable} from 'rxjs';
import {RoomInfoMessage} from './room-info.interface';

@Injectable()
export class RoomInfoService {
   //  private roomInfoSubject: Observable<RoomInfoMessage>;

    // private mockRoom: RoomInfo = {
    //     description: 'Room description',
    //     id: '2323',
    //     master: null,
    //     name: 'New room',
    //     userCount: 0
    // };
    // private mockRoomInfo: Message<RoomInfoMessage> = {
    //     payload: {
    //         info: [this.mockRoom],
    //     },
    //     roomId: '2323',
    //     type: 'roomInfo'
    // };

    constructor(@Inject(WebSocketService) private webSocketService: WebSocketService) {
    }

    public create(): Observable<RoomInfoMessage> {
        console.log('Room info Ovde?');
        // this.roomInfoSubject = this.webSocketService.getWebSocket()
        //     .filter((msg: Message<RoomInfoMessage>) => msg.type == 'roomInfo')
        //     .map((msg: Message<RoomInfoMessage>) => {
        //         return msg.payload;
        //     })
        //     .catch(error => {
        //         return Observable.of(this.mockRoomInfo.payload);
        //     });

        return Observable.empty();
    }

}
