import {Injectable} from '@angular/core';
import {GraphSocketInterface, GraphMessage} from './graph-socket';
import {GraphJson} from '../../../models/graph.model';

@Injectable()
export class MockGraphSocketService extends GraphSocketInterface {

    /**
     * Mock graph to be next-ed on request.
     * @type {GraphMessage}
     * @private
     */
    private _dummyGraph: GraphMessage = {
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
                    label: 'p',
                    weight: 1,
                },
                {
                    id: 'edge-1',
                    from: 'node-0',
                    to: 'node-2',
                    label: 'q',
                    weight: 2,
                },
                {
                    id: 'edge-2',
                    from: 'node-1',
                    to: 'node-4',
                    label: 'r',
                    weight: 4,
                },
                {
                    id: 'edge-3',
                    from: 'node-2',
                    to: 'node-3',
                    label: 's',
                    weight: 1,
                },
                {
                    id: 'edge-4',
                    from: 'node-4',
                    to: 'node-0',
                    label: 't',
                    weight: 2,
                },
            ],
            nextNodeId: 5,
            nextEdgeId: 5,
        },
    };

    /**
     * Mock service just next-s _dummyGraph on request
     * @override
     * @public
     */
    public requestGraphMessage(): void {
        this.graphSocket$.next(this._dummyGraph);
    }

    /**
     * Empty override. It doesn't need to send graph to anyone.
     * @param graph
     * @override
     * @public
     */
    public send(graph: GraphJson): void {
        // do nothing
    }

    constructor() {
        super();
    }

}
