import {Injectable} from "@angular/core";
import {Graph} from "graphlib";
import {
    BreadthFirstSearchState,
    breadthFirstSearch
} from "../algorithms/breadth-first-search";
import {VisNgNetworkOptionsEdges} from "@lazarljubenovic/vis-ng/core";
import {GrfGraphNodeOptions} from "../graph/graph.module";
import {ReplaySubject} from "rxjs";
import {ClickPosition} from "../user-interface/toolbar/toolbar.component";

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

    private graph: Graph;
    private root: string;
    private algorithm: Function = breadthFirstSearch;
    private normalizedStates: NormalizedState[];

    private _currentStateIndex: number = 0;
    private set currentStateIndex(currentStateIndex: number) {
        this._currentStateIndex = currentStateIndex;
        this.onCurrentStateChange();
    }

    private get currentStateIndex(): number {
        return this._currentStateIndex;
    }

    public currentState$ = new ReplaySubject<NormalizedState>(1);

    public setGraph(graph: Graph, root: string) {
        if (root == null || graph == null) {
            return;
        }
        this.graph = graph;
        this.root = root;
        this.normalizedStates = this.algorithm(this.graph, this.root)
            .map(state => this.getNormalizedState(state));
        this.onCurrentStateChange();
    }

    private onCurrentStateChange(): void {
        this.currentState$.next(this.normalizedStates[this.currentStateIndex]);
    }

    public updateStateNumber(action: string): void {
        switch (action) {
            case 'next':
                this.currentStateIndex++;
                break;
            case 'prev':
                this.currentStateIndex--;
                break;
            case 'first':
                this.currentStateIndex = 0;
                break;
            case 'last':
                this.currentStateIndex = this.normalizedStates.length - 1;
                break;
        }
    }

    public setPosition(nodeId: string, position: ClickPosition): void {
        this.normalizedStates[this.currentStateIndex].nodes
            .find(node => node.id == nodeId).position = position;
        this.currentState$.next(this.normalizedStates[this.currentStateIndex]);
    }

    private getNormalizedState(state: BreadthFirstSearchState): NormalizedState {
        const nodes: GrfGraphNodeOptions[] = state.nodes.map((node, i) => {
            return {
                id: state.nodeIds[i],
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

        return {
            nodes,
            edges,
            queue,
            solution,
            accentColor,
            primaryColor,
            secondaryColor,
        };
    }

    constructor() {
    }

}
