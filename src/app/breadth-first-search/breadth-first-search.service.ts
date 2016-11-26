import {Injectable} from "@angular/core";
import {Graph} from "graphlib";
import {BreadthFirstSearchState, breadthFirstSearch} from "../algorithms/breadth-first-search";
import {VisNgNetworkOptionsEdges} from "@lazarljubenovic/vis-ng/core";
import {GrfGraphNodeOptions} from "../graph/graph.module";

export interface NormalizedState {
    nodes: GrfGraphNodeOptions[];
    edges: VisNgNetworkOptionsEdges[];
    solution: string[];
    stack?: string[];
    queue?: string[];
    accentColor?: string[];
    primaryColor?: string[];
    secondaryColor?: string[];
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
                isAccentColor: state.currentNode == node,
                isPrimaryColor: state.currentNeighbor == node,
                isSecondaryColor: false,
                isDimmedColor: state.visitedNodes.indexOf(node) != -1,
            };
        });
        const edges: VisNgNetworkOptionsEdges[] = state.edges;
        const queue: string[] = state.currentQueue;
        const solution: string[] = state.currentSolution;
        const accentColor: string[] = [state.currentNode];
        const primaryColor: string[] = [state.currentNeighbor];
        const secondaryColor: string[] = [];

        return {nodes, edges, queue, solution, accentColor, primaryColor, secondaryColor};
    }

    constructor() {
    }

}
