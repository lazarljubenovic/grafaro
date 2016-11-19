import {Injectable} from "@angular/core";
import {Graph} from "graphlib";
import {BreadthFirstSearchState, breadthFirstSearch} from "../algorithms/breadth-first-search";
import {VisNgNetworkOptionsEdges} from "@lazarljubenovic/vis-ng/core";
import {GrfGraphNodeOptions} from "../graph/graph.module";

export interface NormalizedState {
    nodes: GrfGraphNodeOptions[];
    edges: VisNgNetworkOptionsEdges[];
}

@Injectable()
export class BreadthFirstSearchService {

    public algorithm: Function = breadthFirstSearch;

    public getStates(graph: Graph, root: string): BreadthFirstSearchState[] {
        return this.algorithm(graph, root);
    }

    public getNormalizedState(state: BreadthFirstSearchState): NormalizedState {
        const nodes: GrfGraphNodeOptions[] = state.nodes.map(node => {
            return {
                id: node,
                label: node,
                weight: undefined,
                isStart: state.rootNode == node,
                isEnd: false,
                state: state.currentNode == node ? 'current' : state.visitedNodes.indexOf(node) != -1 ? 'visited' : 'default',
            }
        });
        const edges: VisNgNetworkOptionsEdges[] = state.edges;
        return {nodes, edges};
    }

    constructor() {
    }

}
