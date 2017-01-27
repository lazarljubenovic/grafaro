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
        // this.joinSubject = this.webSocketService.getWebSocket()
        //     .filter((msg: Message<JoinMessageInfo>) => msg.type == 'join')
        //     .map((msg: Message<JoinMessageInfo>) => {
        //         this.isMaster = msg.payload.isMaster;
        //         return msg.payload;
        //     })
        //     .catch(error => {
        //         console.log('Join error');
        //         this.isMaster = true;
        //         return Observable.of({roomId: '2323', isMaster: true});
        //     });

        return Observable.empty();
    }

    public newRoom(): void {
        this.webSocketService.send({}, 'create');
    }

    public joinRoom(id: string): void {
        this.webSocketService.roomId = id;
        this.webSocketService.send({id}, 'join');
    }

}
