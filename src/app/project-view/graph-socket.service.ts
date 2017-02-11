import {Injectable} from '@angular/core';
import {WebSocketService} from '../websocket.service';
import {GraphJson} from '../models/graph.model';
import {Observable} from 'rxjs';

export interface GraphMessage {
    graph: GraphJson;
}

@Injectable()
export class GraphSocketService {
    public graphSocket$: Observable<GraphMessage>;
    public canSend: boolean = false;

    constructor(private _webSocketService: WebSocketService) {
        this.graphSocket$ = this._webSocketService.subscribeTo('graph');
    }

    public send(graph: GraphJson): void {
        if (this.canSend) {
            this._webSocketService.send({graph}, 'graph');
        }
    }

}
