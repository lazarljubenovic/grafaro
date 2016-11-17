import {Injectable} from "@angular/core";
import {Graph} from "graphlib";
import {BreadthFirstSearchState, breadthFirstSearch} from "../algorithms/breadth-first-search";
import {
    VisNgOptionsNodes,
    VisNgOptionsEdges
} from "@lazarljubenovic/vis-ng/esm/core/vis-graph/options.interface";

export interface NormalizedState {
    nodes: VisNgOptionsNodes[];
    edges: VisNgOptionsEdges[];
}

@Injectable()
export class BreadthFirstSearchService {

    public algorithm: Function = breadthFirstSearch;

    public getStates(graph: Graph, root: string): BreadthFirstSearchState[] {
        return this.algorithm(graph, root);
    }

    public getNormalizedState(state: BreadthFirstSearchState): NormalizedState {
        const nodes: VisNgOptionsNodes[] = state.nodes.map(node => {
            return {
                id: node,
                label: node,
                color: {
                    background: state.currentNode == node ? 'red'
                        : state.visitedNodes.indexOf(node) != -1 ? 'grey'
                        : 'white',
                },
            }
        });
        const edges: VisNgOptionsEdges[] = state.edges;
        return {nodes, edges};
    }

    constructor() {
    }

}
