import {Injectable, Inject} from '@angular/core';
import {WebSocketService} from '../core/websocket.service';
import {Graph} from '../models/graph.model';
import {Observable} from 'rxjs';
import {Message} from '../message';

export interface GraphInfoMessage {
    graph: Graph;
    algorithm: any;
}

@Injectable()
export class GraphSocketService {
    private graphSubject: Observable<GraphInfoMessage>;

    constructor(@Inject(WebSocketService) private webSocketService: WebSocketService) {
    }

    public create(): Observable<GraphInfoMessage> {
        this.graphSubject = this.webSocketService.getWebSocket()
            .filter((msg: Message<GraphInfoMessage>) => msg.type == 'graph')
            .map((msg: Message<GraphInfoMessage>) => {
                return msg.payload;
            });

        return this.graphSubject;
    }

}
