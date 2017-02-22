import {Injectable} from '@angular/core';
import {GraphJson, Graph} from '../../../models/graph.model';
import {GraphSocketInterface, GraphMessage} from './graph-socket';
import {Subscription, ReplaySubject} from 'rxjs';
import {WebSocketService} from '../../../websocket.service';
import {GraphSocketService} from './graph-socket.service';
import {MockGraphSocketService} from './mock-graph-socket.service';

@Injectable()
export class GraphStorageService {

    /**
     * Determine if outgoing graph message should be blocked.
     * @public
     * @type {boolean}
     */
    public canSend: boolean = false;
    /**
     * Graph message producer.
     * @type {GraphSocketInterface}
     * @private
     */
    private _graphSource: GraphSocketInterface;
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
     * Stream of graph messages coming from producers.
     * @type {ReplaySubject<GraphMessage>}
     * @public
     */
    public graphMessages$: ReplaySubject<GraphMessage>;

    constructor(private _webSocketService: WebSocketService) {
        this.graphMessages$ = new ReplaySubject(1);

        this._webSocketService.socketStatus.subscribe(status => {
            if (status) {
                this._graphSource = new GraphSocketService(this._webSocketService);
            } else {
                this._graphSource = new MockGraphSocketService();
            }

            if (this._messageSubscription) {
                this._messageSubscription.unsubscribe();
            }
            this._messageSubscription = this._graphSource.graphSocket$.subscribe(message => {
                this.graphMessages$.next(message);
            });

            if (this._requestBuffer) {
                this._requestBuffer = false;
                this._graphSource.requestGraphMessage();
            }
        });
    }

    /**
     * Delegate wrapper of producer's method.
     * @param graph
     * @public
     */
    public send(graph: GraphJson): void {
        if (this.canSend) {
            this._graphSource.send(graph);
        }
    }

    /**
     * Delegate wrapper of producer's method.
     * @public
     */
    public requestGraphMessage(): void {
        if (this._graphSource) {
            this._graphSource.requestGraphMessage();
        } else {
            this._requestBuffer = true;
        }
    }

    /**
     * Restore graph to just single node.
     * I have 0 idea why it won't accept empty graph, so just let it be like this.
     * @public
     */
    public restartGraph(): void {
        let graph = new Graph();
        graph.addNode('A', {x: 0, y: 0});
        this.graphMessages$.next({graph: graph.writeJson()});
    }

}
