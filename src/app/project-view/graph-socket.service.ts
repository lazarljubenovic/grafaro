import {Injectable, Inject} from '@angular/core';
import {WebSocketService} from '../core/websocket.service';
import {GraphJson} from '../models/graph.model';
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

    public mockGraphInfoMessage: GraphInfoMessage = {
        graph: {
            nodes: [
                {
                    id: 'node-0',
                    label: 'A',
                    position: {
                        x: 100,
                        y: 100
                    },
                    weight: 1
                },
                {
                    id: 'node-1',
                    label: 'B',
                    position: {
                        x: 150,
                        y: 150
                    },
                    weight: 1
                }
            ],
            edges: [
                {
                    id: 'edge-0',
                    from: 'node-0',
                    to: 'node-1',
                    label: '1',
                    weight: 1
                }
            ],
            nextNodeId: 2,
            nextEdgeId: 1,
        },
        algorithm: {
            id: 'bfs',
            options: {
                root: 'node-0'
            }
        }
    };


    constructor(@Inject(WebSocketService) private webSocketService: WebSocketService) {
    }

    public create(): Observable <GraphInfoMessage> {
        this.graphSubject = this.webSocketService.getWebSocket()
            .filter((msg: Message<GraphInfoMessage>) => msg.type == 'graph')
            .map((msg: Message<GraphInfoMessage>) => {
                this.algorithm = msg.payload.algorithm;
                return msg.payload;
            })
            .catch(error => {
                console.log('Graph info service');
                return Observable.of(this.mockGraphInfoMessage);
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
