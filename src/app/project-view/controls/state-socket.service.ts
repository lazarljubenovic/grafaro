import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {WebSocketService} from '../../websocket.service';
import {MasterStorageService} from '../../shared/master-service/master-storage.service';

export interface StateMessage {
    stateIndex: number;
}

@Injectable()
export class StateSocketService {
    public stateSocket$: Observable<StateMessage>;
    public canSend: boolean = false;

    constructor(private _webSocketService: WebSocketService,
                private _masterStorage: MasterStorageService
    ) {
        this.stateSocket$ = this._webSocketService.subscribeTo('state');
        this._masterStorage.masterMessages$.subscribe(master => {
            // todo something with this, it's awful
            this.canSend = master.isMaster;
        });
    }

    public send(stateIndex: number) {
        if (this.canSend) {
            this._webSocketService.send({stateIndex}, 'state');
        }
    }

}
