import {Injectable, Inject} from '@angular/core';
import {WebSocketService} from '../websocket.service';
import {GraphJson} from '../models/graph.model';
import {Observable} from 'rxjs';

export interface GraphInfoMessage {
    graph: GraphJson;
    algorithm: any;
}

@Injectable()
export class GraphSocketService {
    // private graphSubject: Observable<GraphInfoMessage>;
    private algorithm: any = {}; // todo something with this

    constructor(@Inject(WebSocketService) private webSocketService: WebSocketService) {
    }

    public create(): Observable <GraphInfoMessage> {
        let stream = this.webSocketService.subscribeTo('graph');
        stream.subscribe(message => this.algorithm = message.algorithm);
        return stream;
    }

    public changeGraphAndAlgorithm(graph: GraphJson, algorithm?: any): void {
        const message: GraphInfoMessage = {
            graph,
            algorithm: this.algorithm
        };

        this.webSocketService.send(message, 'graph');
    }

}
