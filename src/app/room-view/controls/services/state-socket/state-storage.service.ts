import {Injectable} from '@angular/core';
import {StateSocketInterface, StateMessage} from './state-socket';
import {Subscription, ReplaySubject} from 'rxjs';
import {WebSocketService} from '../../../../websocket.service';
import {MockStateSocketService} from './mock-state-socket.service';
import {MasterStorageService} from '../../../../shared/master-service/master-storage.service';
import {StateSocketService} from './state-socket.service';

@Injectable()
export class StateStorageService {
    private _canSend: boolean = false;
    private _stateSoucre: StateSocketInterface;
    private _messageSubscription: Subscription;
    private _requestBuffer: boolean = false;
    public stateMessage$: ReplaySubject<StateMessage>;

    constructor(private _webSocketService: WebSocketService,
                private _masterStorage: MasterStorageService) {
        this.stateMessage$ = new ReplaySubject(1);

        this._webSocketService.socketStatus.subscribe(status => {
            if (status) {
                this._stateSoucre = new StateSocketService(this._webSocketService);
            } else {
                this._stateSoucre = new MockStateSocketService();
            }

            if (this._messageSubscription) {
                this._messageSubscription.unsubscribe();
            }
            this._messageSubscription = this._stateSoucre.stateSocket$.subscribe(message => {
                this.stateMessage$.next(message);
            });

            if (this._requestBuffer) {
                this._requestBuffer = false;
                this._stateSoucre.requestStateMessage();
            }
        });

        this._masterStorage.masterMessages$
            .subscribe(message => this._canSend = message.isMaster);
    }

    public requestStateMessage(): void {
        if (this._stateSoucre) {
            this._stateSoucre.requestStateMessage();
        } else {
            this._requestBuffer = true;
        }
    }

    public send(stateIndex: number): void {
        if (this._canSend) {
            this._stateSoucre.send(stateIndex);
        }
    }

    public restartState(): void {
        this.stateMessage$.next({stateIndex: 1});
    }
}
