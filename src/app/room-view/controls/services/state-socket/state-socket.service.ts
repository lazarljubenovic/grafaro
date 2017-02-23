import {Injectable} from '@angular/core';
import {WebSocketService} from '../../../../websocket.service';
import {StateSocketInterface} from './state-socket';


@Injectable()
export class StateSocketService extends StateSocketInterface {

    constructor(private _webSocketService: WebSocketService) {
        super();
        this._webSocketService.subscribeTo('state')
            .subscribe(message => this.stateSocket$.next(message));
    }

    public send(stateIndex: number) {
        this._webSocketService.send({stateIndex}, 'state');
    }

    public requestStateMessage(): void {
        this._webSocketService.send({}, 'state-request');
    }

}
