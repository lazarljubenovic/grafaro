import {Subject} from 'rxjs';
import {GraphJson} from '../../../models/graph.model';

export interface GraphMessage {
    graph: GraphJson;
}

export abstract class GraphSocketInterface {
    /**
     * Stream of graph messages.
     * @type {Subject<Graphmessage>}
     * @public
     */
    public graphSocket$: Subject<GraphMessage>;

    /**
     * Abstract function which implements graph sending to server.
     * @abstract
     * @param graph
     * @public
     */
    public abstract send(graph: GraphJson): void;

    /**
     * Abstract function for requesting graph from server.
     */
    public abstract requestGraphMessage(): void;

    constructor() {
        this.graphSocket$ = new Subject();
    }
}
