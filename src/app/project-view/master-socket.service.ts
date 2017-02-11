import {Injectable} from '@angular/core';
import {WebSocketService} from '../websocket.service';
import {Observable} from 'rxjs';

export interface MasterMessage {
    isMaster: boolean;
}

@Injectable()
export class MasterSocketService {
    public masterSocket$: Observable<MasterMessage>;

    constructor(private webSocketService: WebSocketService) {
        this.masterSocket$ = this.webSocketService.subscribeTo('master');
    }

}
