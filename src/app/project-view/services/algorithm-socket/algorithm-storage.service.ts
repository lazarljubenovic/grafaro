import {Injectable} from '@angular/core';
import {Subscription, ReplaySubject} from 'rxjs';
import {WebSocketService} from '../../../websocket.service';
import {AlgorithmSocketInterface, AlgorithmMessage} from './algorithm-socket';
import {AlgorithmSocketService} from './algorithm-socket.service';
import {MockAlgorithmSocketService} from './mock-algorithm-socket.service';
import {FormOptions} from '../../algorithm-picker/algorithm-picker.component';

@Injectable()
export class AlgorithmStorageService {

    /**
     * Determine if outgoing algorithm with options message should be blocked.
     * @public
     * @type {boolean}
     */
    public canSend: boolean = false;
    /**
     * Algorithm with options message producer.
     * @type {GraphSocketInterface}
     * @private
     */
    private _algorithmSource: AlgorithmSocketInterface;
    /**
     * Subscription for incoming messages.
     * @type {Subscription}
     * @private
     */
    private _messageSubscription: Subscription;
    /**
     * Request buffer.
     * @type {boolean}
     * @private
     */
    private _requestBuffer: boolean = false;
    /**
     * Stream of algorithm with options messages coming from producers.
     * @type {ReplaySubject<AlgorithmMessage>}
     * @public
     */
    public algorithmMessages$: ReplaySubject<AlgorithmMessage>;

    constructor(private _webSocketService: WebSocketService) {
        this.algorithmMessages$ = new ReplaySubject(1);

        this._webSocketService.socketStatus.subscribe(status => {
            if (status) {
                this._algorithmSource = new AlgorithmSocketService(this._webSocketService);
            } else {
                this._algorithmSource = new MockAlgorithmSocketService();
            }

            if (this._messageSubscription) {
                this._messageSubscription.unsubscribe();
            }
            this._messageSubscription = this._algorithmSource.algorithmSocket$
                .subscribe(message => {
                this.algorithmMessages$.next(message);
            });

            if (this._requestBuffer) {
                this._requestBuffer = false;
                this._algorithmSource.requestAlgorithmWithOptions();
            }
        });
    }

    /**
     * Delegate wrapper of producer's method.
     * @param info
     * @public
     */
    public send(info: FormOptions): void {
        if (this.canSend) {
            this._algorithmSource.send(info);
        }
    }

    /**
     * Delegate wrapper of producer's method.
     * @public
     */
    public requestAlgorithmWithOptions(): void {
        if (this._algorithmSource) {
            this._algorithmSource.requestAlgorithmWithOptions();
        } else {
            this._requestBuffer = true;
        }
    }

    /**
     * Restore algorithm to default values.
     * @public
     */
    public restartAlgorithmWithOptions(): void {
        this.algorithmMessages$.next({
            info: {
                algorithm: 'bfs',
                options: {
                    root: 'A',
                },
            }
        });
    }

}
