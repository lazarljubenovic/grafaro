import {Injectable} from '@angular/core';
import {WebSocketService} from '../../../websocket.service';
import {GraphJson} from '../../../models/graph.model';
import {GraphSocketInterface} from './graph-socket';


@Injectable()
export class GraphSocketService extends GraphSocketInterface {

    /**
     * Send graph-request message to real server.
     * @public
     * @override
     */
    public requestGraphMessage(): void {
        this._webSocketService.send({}, 'graph-request');
    }

    /**
     * Send graph message to real server.
     * @param graph
     * @public
     * @override
     */
    public send(graph: GraphJson): void {
        this._webSocketService.send({graph}, 'graph');
    }

    constructor(private _webSocketService: WebSocketService) {
        super();
        this._webSocketService.subscribeTo('graph')
            .subscribe(message => this.graphSocket$.next(message));
    }

}
