import {Injectable, Inject} from '@angular/core';
import {WebSocketService} from '../core/websocket.service';
import {Graph, GraphJson} from '../models/graph.model';
import {Observable} from 'rxjs';
import {Message} from '../message';

export interface GraphInfoMessage {
    graph: GraphJson;
    algorithm: any;
}

@Injectable()
export class GraphSocketService {
    private graphSubject: Observable<GraphInfoMessage>;
    private algorithm: any = {}; // todo something with this

    constructor(@Inject(WebSocketService) private webSocketService: WebSocketService) {
    }

    public create(): Observable<GraphInfoMessage> {
        this.graphSubject = this.webSocketService.getWebSocket()
            .filter((msg: Message<GraphInfoMessage>) => msg.type == 'graph')
            .map((msg: Message<GraphInfoMessage>) => {
                this.algorithm = msg.payload.algorithm;
                return msg.payload;
            });

        return this.graphSubject;
    }

    public changeGraphAndAlgorithm(graph: GraphJson, algorithm?: any): void {
        const message: GraphInfoMessage = {
            graph,
            algorithm: this.algorithm
        };

        this.webSocketService.send(message, 'graph');
    }

}
