import {Injectable} from '@angular/core';
import {JoinSocketInterface} from './join-socket';
import {Subscription, Subject} from 'rxjs';
import {JoinMessageInfo, JoinSocketService} from './join-socket.service';
import {WebSocketService} from '../../websocket.service';
import {MockJoinSocketService} from './mock-join-socket.service';

/**
 * Mediator class for determining which producer should be used as a source of Join messages.
 */
@Injectable()
export class JoinStorageService {

    /**
     * Join message producer.
     * @type {JoinSocketInterface}
     * @private
     */
    private _joinSource: JoinSocketInterface;
    /**
     * Subscription for incoming messags.
     * @type {Subscription}
     * @private
     */
    private _messageSubscription: Subscription;
    /**
     * Buffer room id. It's not possible to buffer more then one Join message.
     * @type {string}
     * @private
     */
    private _joinMessageBuffer: string = '';
    /**
     * Stream of join messages coming from producers.
     * @type {Subject<JoinmessageInfo>}
     * @public
     */
    public joinMessages$: Subject<JoinMessageInfo>;

    /**
     *
     * @param _webSocketService
     */
    constructor(private _webSocketService: WebSocketService) {
        this.joinMessages$ = new Subject();

        // Depending on WebSocket status, determine which producer to use
        this._webSocketService.socketStatus.subscribe(status => {
            if (status) {
                this._joinSource = new JoinSocketService(this._webSocketService);
            } else {
                this._joinSource = new MockJoinSocketService();
            }

            // Unsubscribe from previouse producer
            if (this._messageSubscription) {
                this._messageSubscription.unsubscribe();
            }
            this._messageSubscription = this._joinSource.joinSocket$.subscribe(message => {
                this.joinMessages$.next(message);
            });

            // If there was any buffered message, resend it
            if (this._joinMessageBuffer != '') {
                this._joinSource.joinRoom(this._joinMessageBuffer);
                this._joinMessageBuffer = '';
            }
        });
    }

    /**
     * Delegate wrapper of producer's method.
     */
    public newRoom(): void {
        this._joinSource.newRoom();
    }

    /**
     * Delegate wrapper of producer's method.
     * @param id ID of a room user wishes to join
     */
    public joinRoom(id: string): void {
        if (this._joinSource) {
            this._joinSource.joinRoom(id);
        } else {
            this._joinMessageBuffer = id;
        }
    }

    /**
     * Delegate wrapper of producer's method.
     * @param id ID of a room user joined
     */
    public setRoom(id: string): void {
        this._joinSource.setRoom(id);
    }

}
