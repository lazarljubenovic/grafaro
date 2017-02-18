import {Injectable} from '@angular/core';
import {WebSocketService} from '../../websocket.service';
import {MasterSocketInterface} from './master-socket';

/**
 * Real socket service that communicates with server.
 */
@Injectable()
export class MasterSocketService extends MasterSocketInterface {

    /**
     * Send empty message with type Master to indicate that you want request master message.
     */
    public requestMasterMessage(): void {
        this.webSocketService.send({}, 'master');
    }

    constructor(private webSocketService: WebSocketService) {
        super();
        this.webSocketService.subscribeTo('master')
            .subscribe(message => {
                this.masterSocket$.next(message);
            });
    }

}
