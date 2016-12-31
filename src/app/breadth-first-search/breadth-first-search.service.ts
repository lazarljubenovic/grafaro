import {Injectable} from '@angular/core';
import {
    BreadthFirstSearchState,
    breadthFirstSearch,
    breadthFirstSearchNormalizer
} from '../algorithms/breadth-first-search';
import {VisNgNetworkOptionsEdges} from '@lazarljubenovic/vis-ng/core';
import {GrfGraphNodeOptions} from '../graph/graph.module';
import {ReplaySubject} from 'rxjs';
import {ClickPosition} from '../project-view/toolbar/toolbar.component';
import {Graph} from '../models/graph.model';

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

    public graph = new Graph();
    // .setNode('100', 'A')
    // .setNode('101', 'B')
    // .setNode('102', 'C')
    // .setNode('103', 'D')
    // .setNode('104', 'E')
    // .setNode('105', 'F')
    // .setNode('106', 'G')
    // .setNode('107', 'H')
    // .setNode('108', 'I')
    // .setNode('109', 'J')
    // .setEdge('100', '101', '1');
    // .setEdge('100', '102', '2')
    // .setEdge('100', '103', '3')
    // .setEdge('101', '104', '4')
    // .setEdge('102', '105', '5')
    // .setEdge('102', '106', '6')
    // .setEdge('106', '107', '7')
    // .setEdge('104', '109', '8')
    // .setEdge('109', '108', '9')
    // .setEdge('103', '108', '10')
    // .setEdge('106', '108', '11');

    public root: string = 'node-0';

    private algorithm: Function = breadthFirstSearch;
    private states: BreadthFirstSearchState[];
    private normalizedStates: NormalizedState[];

    private _currentStateIndex: number = 0;
    private set currentStateIndex(currentStateIndex: number) {
        this._currentStateIndex = currentStateIndex;
        this.onGraphChange();
    }

    private get currentStateIndex(): number {
        return this._currentStateIndex;
    }

    public currentNormalizedState$ = new ReplaySubject<NormalizedState>(1);
    public currentState$ = new ReplaySubject<BreadthFirstSearchState>(1);

    public graphState$ = new ReplaySubject<Graph>(1);

    public setGraph() {
        try {
            this.states = this.algorithm(this.graph, this.root);
            this.normalizedStates = this.states.map(state => this.getNormalizedState(state));
            this.fixCurrentStateIndex();
            this.onGraphChange();
        } catch (error) {
            console.log(error); // todo
        }
    }

    private onGraphChange(): void {
        this.currentState$.next(this.states[this.currentStateIndex]);
        this.currentNormalizedState$.next(this.normalizedStates[this.currentStateIndex]);
        this.graphState$.next(this.graph);
    }

    private currentStateIndexInc() {
        if (this.currentStateIndex < this.normalizedStates.length - 1) {
            this.currentStateIndex++;
        }
    }

    private currentStateIndexDec() {
        if (this.currentStateIndex > 0) {
            this.currentStateIndex--;
        }
    }

    private currentStateIndexFirst() {
        this.currentStateIndex = 0;
    }

    private currentStateIndexLast() {
        this.currentStateIndex = this.normalizedStates.length - 1;

    }

    public updateStateNumber(action: string): void {
        switch (action) {
            case 'next':
                this.currentStateIndexInc();
                break;
            case 'prev':
                this.currentStateIndexDec();
                break;
            case 'first':
                this.currentStateIndexFirst();
                break;
            case 'last':
                this.currentStateIndexLast();
                break;
        }
    }

    private fixCurrentStateIndex(): void {
        if (this.currentStateIndex > this.normalizedStates.length - 1) {
            this.currentStateIndex = this.normalizedStates.length - 1;
        }
        if (this.currentStateIndex < 0) {
            this.currentStateIndex = 0;
        }
    }

    public getNodeId(nodeLabel: string): string {
        return this.graph.getNodeId(nodeLabel);
    }

    public getNodeLabel(nodeId: string): string {
        return this.graph.getNodeLabel(nodeId);
    }

    private existsNodeWithLabel(nodeLabel: string): boolean {
        const nodeId: string = this.graph.getNodeId(nodeLabel);
        return this.graph.hasNodeId(nodeId);
    }

    public suggestNewNodeName(): string {
        const labels: string[] = this.graph.nodes.map(node => node.label).sort();
        const lastLabel: string = labels[labels.length - 1];
        if (!Number.isNaN(Number.parseInt(lastLabel))) {
            return lastLabel + 1;
        } else {
            const lastCharCode: number = lastLabel.slice(-1).charCodeAt(0);
            const newLastChar: string = String.fromCharCode(lastCharCode + 1);
            return lastLabel.slice(0, -1).concat(newLastChar);
        }
    }

    public addNode(position: ClickPosition): void {
        const label: string = this.suggestNewNodeName();
        this.graph.addNode(label, position);
        this.setGraph();
        this.setPosition(label, position);
    }

    public addNodeOnRandomPlace(): void {
        const x: number = Math.random() * 100;
        const y: number = Math.random() * 100;

        this.addNode({y, x});
    }

    public removeNode(nodeId: string): void {
        this.graph.removeNode(nodeId);
        if (nodeId == this.root) {
            this.root = this.graph.nodes[0].id;
        }
        this.setGraph();
    }

    public renameNode(oldNodeLabel: string, newNodeLabel: string): void {
        if (newNodeLabel === '' || newNodeLabel == oldNodeLabel) {
            return;
        }
        if (this.existsNodeWithLabel(newNodeLabel)) {
            throw new Error(`Node with label ${newNodeLabel} already exists.`);
        }
        const id: string = this.getNodeId(oldNodeLabel);
        this.graph.changeNodeLabel(id, newNodeLabel);
        this.setGraph();
    }

    public linkNodes(nodeA: string, nodeB: string) {
        this.graph.addEdge(nodeA, nodeB, 'foobar');
        this.setGraph();
    }

    public linkNodesByLabel(labelA: string, labelB: string) {
        const nodeA: string = this.getNodeId(labelA);
        const nodeB: string = this.getNodeId(labelB);

        this.linkNodes(nodeA, nodeB);
    }

    public unlinkNodes(nodeA: string, nodeB: string) {
        (<any>this.graph).removeEdge(nodeA, nodeB);
        this.setGraph();
    }

    public unlinkNodesByLabel(labelA: string, labelB: string) {
        const nodeA: string = this.getNodeId(labelA);
        const nodeB: string = this.getNodeId(labelB);

        this.unlinkNodes(nodeA, nodeB);
    }

    public removeEdge(edgeId: string) {
        const edge = this.graph.getEdge(edgeId);
        this.unlinkNodes(edge.from, edge.to);
        this.setGraph();
    }

    private setPosition(nodeLabel: string, position: ClickPosition): void {
        this.normalizedStates[this.currentStateIndex].nodes
            .find(node => node.label == nodeLabel).position = position;
        this.onGraphChange();
    }

    private getNormalizedState(state: BreadthFirstSearchState): NormalizedState {
        return breadthFirstSearchNormalizer(state);
    }

    constructor() {
        this.setGraph();
    }

}
