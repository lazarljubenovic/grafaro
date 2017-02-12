import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {WebSocketService} from '../../websocket.service';

export interface StateMessage {
    stateIndex: number;
}

@Injectable()
export class StateSocketService {
    public stateSocket$: Observable<StateMessage>;
    public canSend: boolean = false;

    constructor(private _webSocketService: WebSocketService) {
        this.stateSocket$ = this._webSocketService.subscribeTo('state');
    }

    public send(stateIndex: number) {
        if (this.canSend) {
            this._webSocketService.send({stateIndex}, 'state');
        }
    }

}
