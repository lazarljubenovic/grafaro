import {Injectable} from '@angular/core';
import {VisNgNetworkOptionsEdges} from '@lazarljubenovic/vis-ng/core';
import {GrfGraphNodeOptions} from '../graph/graph.module';
import {ReplaySubject} from 'rxjs';
import {ClickPosition} from '../project-view/toolbar/toolbar.component';
import {Graph} from '../models/graph.model';
import {AlgorithmBase, AlgorithmState} from './algorithm-base';
import {DepthFirstSearchAlgorithm} from './depth-first-search';

export interface NormalizedState {
    nodes: GrfGraphNodeOptions[];
    edges: VisNgNetworkOptionsEdges[];
    solution?: string[];
    stack?: string[];
    queue?: string[];
    accentColor?: string[];
    primaryColor?: string[];
    secondaryColor?: string[];
}

@Injectable()
export class AlgorithmService {

    public graph = new Graph();

    private _root: string = 'node-0';

    public get root(): string {
        return this._root;
    }

    public set root(value: string) {
        this._root = value;
        this.setGraph();
    }

    public algorithmStrategy: AlgorithmBase;
    private states: AlgorithmState[];
    private normalizedStates: NormalizedState[];

    private _currentStateIndex: number = 0;
    public set currentStateIndex(currentStateIndex: number) {
        this._currentStateIndex = currentStateIndex;
        this.onGraphChange();
    }

    public get currentStateIndex(): number {
        return this._currentStateIndex;
    }

    public get totalNumberOfStates(): number {
        if (this.states) {
            return this.states.length;
        } else {
            return 0;
        }
    }

    public currentNormalizedState$ = new ReplaySubject<NormalizedState>(1);
    public currentState$ = new ReplaySubject<AlgorithmState>(1);

    public graphState$ = new ReplaySubject<Graph>(1);

    public setAlgorithm(algorithmStrategy: AlgorithmBase): void {
        this.algorithmStrategy = algorithmStrategy;
        this.setGraph();
    }

    public getCodeJson() {
        const state = this.states[this.currentStateIndex];
        const tracked = this.algorithmStrategy.trackedVariables;
        return this.algorithmStrategy.getCodeJson(state, tracked);
    }

    public setGraph() {
        try {
            this.states = this.algorithmStrategy.algorithmFunction(this.graph, this._root);
            this.normalizedStates = this.states.map(state => this.getNormalizedState(state));
            this.fixCurrentStateIndex();
            this.onGraphChange();
        } catch (e) {
            console.log(e); // todo
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

    // Returns labels
    public getAllNodes(): string[] {
        return this.graph.nodes.map(node => node.label);
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
        if (nodeId == this._root) {
            this._root = this.graph.nodes[0].id;
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

    public setPosition(nodeLabel: string, position: ClickPosition): void {
        this.normalizedStates[this.currentStateIndex].nodes
            .find(node => node.label == nodeLabel).position = position;
        this.onGraphChange();
    }

    public moveNode(nodeId: string, position: ClickPosition): void {
        this.graph.nodes.find(node => node.id == nodeId).position = position;
        this.setGraph();
    }

    private getNormalizedState(state: AlgorithmState): NormalizedState {
        return this.algorithmStrategy.normalize(state);
    }


    constructor() {
        this.setAlgorithm(new DepthFirstSearchAlgorithm());
    }

}
