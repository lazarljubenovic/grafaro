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

    public mockGraphInfoMessage: GraphInfoMessage = {
        graph: {
            nodes: [
                {
                    id: 'node-0',
                    label: 'A',
                    position: {x: 0, y: 0},
                    weight: 1,
                },
                {
                    id: 'node-1',
                    label: 'B',
                    position: {x: 100, y: 0},
                    weight: 1,
                },
                {
                    id: 'node-2',
                    label: 'C',
                    position: {x: 100, y: 100},
                    weight: 1,
                },
                {
                    id: 'node-3',
                    label: 'D',
                    position: {x: -100, y: 100},
                    weight: 1,
                },
                {
                    id: 'node-4',
                    label: 'E',
                    position: {x: -100, y: 200},
                    weight: 1,
                },
            ],
            edges: [
                {
                    id: 'edge-0',
                    from: 'node-0',
                    to: 'node-1',
                    label: '1',
                    weight: 1,
                },
                {
                    id: 'edge-1',
                    from: 'node-0',
                    to: 'node-2',
                    label: '2',
                    weight: 2,
                },
                {
                    id: 'edge-2',
                    from: 'node-1',
                    to: 'node-4',
                    label: '4',
                    weight: 4,
                },
                {
                    id: 'edge-3',
                    from: 'node-2',
                    to: 'node-3',
                    label: '1',
                    weight: 1,
                },
                {
                    id: 'edge-4',
                    from: 'node-4',
                    to: 'node-0',
                    label: '2',
                    weight: 2,
                },
            ],
            nextNodeId: 2,
            nextEdgeId: 1,
        },
        algorithm: {
            id: 'bfs',
            options: {
                root: 'node-0',
            },
        },
    };


    constructor(@Inject(WebSocketService) private webSocketService: WebSocketService) {
    }

    public create(): Observable <GraphInfoMessage> {
        console.log('Graph Ovde?');
        // this.graphSubject = this.webSocketService.getWebSocket()
        //     .filter((msg: Message<GraphInfoMessage>) => msg.type == 'graph')
        //     .map((msg: Message<GraphInfoMessage>) => {
        //         this.algorithm = msg.payload.algorithm;
        //         return msg.payload;
        //     })
        //     .catch(error => {
        //         console.log('Graph info service');
        //         return Observable.of(this.mockGraphInfoMessage);
        //     });

        return Observable.empty();
    }

    public changeGraphAndAlgorithm(graph: GraphJson, algorithm?: any): void {
        const message: GraphInfoMessage = {
            graph,
            algorithm: this.algorithm
        };

        this.webSocketService.send(message, 'graph');
    }

}
