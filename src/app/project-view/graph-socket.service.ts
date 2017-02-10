import {Injectable} from '@angular/core';
import {WebSocketService} from '../websocket.service';
import {GraphJson} from '../models/graph.model';
import {Observable} from 'rxjs';

// todo algorithm to seperate message
export interface GraphInfoMessage {
    graph: GraphJson;
    // algorithm: any;
}

@Injectable()
export class GraphSocketService {

    constructor(private webSocketService: WebSocketService) {
    }

    public create(): Observable <GraphInfoMessage> {
        console.log('creating graph socket');
        let stream = this.webSocketService.subscribeTo('graph');
        return stream;
    }

    public send(graph: GraphJson): void {
        const message: GraphInfoMessage = {
            graph,
            // algorithm: this.algorithm
        };

        this.webSocketService.send(message, 'graph');
    }

}
