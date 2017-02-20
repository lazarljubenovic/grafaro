import {Injectable} from '@angular/core';
import {WebSocketService} from '../../websocket.service';
import {MasterSocketInterface, MasterMessage} from './master-socket';
import {Subscription, ReplaySubject} from 'rxjs';
import {MasterSocketService} from './master-socket.service';
import {MockMasterSocketService} from './mock-master-socket.service';

@Injectable()
export class MasterStorageService {

    /**
     * Source of incoming and outgoing master messages.
     * @type {MasterSocketInterface}
     * @private
     */
    private _masterSource: MasterSocketInterface;
    /**
     * Subscription of incoming messages.
     * @type {Subscription}
     * @private
     */
    private _messageSubscription: Subscription;
    /**
     * Stream of master messages coming from producers.
     * @type {ReplaySubject<MasterMessage>}
     * @public
     */
    public masterMessages$: ReplaySubject<MasterMessage>;
    /**
     * Buffer of a sort to prevent early requests.
     * @type {boolean}
     */
    private _wasRequested: boolean = false;

    constructor(private _webSocketService: WebSocketService) {
        this.masterMessages$ = new ReplaySubject(1);

        this._webSocketService.socketStatus.subscribe(status => {
            if (status) {
                this._masterSource = new MasterSocketService(this._webSocketService);
            } else {
                this._masterSource = new MockMasterSocketService();
            }

            if (this._messageSubscription) {
                this._messageSubscription.unsubscribe();
            }
            this._messageSubscription = this._masterSource.masterSocket$.subscribe(message => {
                this.masterMessages$.next(message);
            });

            if (this._wasRequested) {
                this._wasRequested = false;
                this.requestMasterMessage();
            }
        });
    }

    /**
     * Method to delegate request to a proper source.
     */
    public requestMasterMessage() {
        if (this._masterSource) {
            this._masterSource.requestMasterMessage();
        } else {
            this._wasRequested = true;
        }
    }

    /**
     * Revert to default master status.
     */
    public restartStorage() {
        this._masterSource.masterSocket$.next({isMaster: false});
    }

}
