import {Injectable} from '@angular/core';
import {Graph} from 'graphlib';

interface GraphJsonNode {
    id: string;
    label: string;
    position: {
        x: number;
        y: number;
    };
}

interface GraphJsonEdge {
    from: string;
    to: string;
    label: string;
    directed: boolean;
}

export interface GraphJson {
    nodes: GraphJsonNode[];
    edges: GraphJsonEdge[];
}

@Injectable()
export class GraphJsonService {

    public writeJson(graph: Graph): GraphJson {
        return {
            nodes: graph.nodes()
                .map(nodeId => ({
                    id: nodeId,
                    label: graph.node(nodeId),
                    position: { // todo
                        x: 0,
                        y: 0,
                    }
                })),
            edges: graph.edges()
                .map(edge => ({
                    from: edge.v,
                    to: edge.w,
                    label: edge.name,
                    directed: false, // todo
                })),
        };
    }

    public readJson() {

    }

    constructor() {
    }

}
