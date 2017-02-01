/* tslint:disable */
import {Injectable} from '@angular/core';
import {VisNgNetworkOptionsEdges} from '@lazarljubenovic/vis-ng/core';
import {GrfGraphNodeOptions} from '../graph/graph.module';
import {ReplaySubject} from 'rxjs';
import {ClickPosition} from '../project-view/toolbar/toolbar.component';
import {Graph} from '../models/graph.model';
import {AlgorithmBase, CodeJson} from './algorithm-base';
import {StateManagerObject, AlgorithmStateManager} from './state-manager';
import {DijkstraShortestPathAlgorithm} from './dijkstra-shortest-path';

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

    public graphState$ = new ReplaySubject<Graph>(1);

    public graph: Graph = new Graph();
    public rootId: string;

    public state$ = new ReplaySubject<StateManagerObject>();
    public normalizedState$ = new ReplaySubject<NormalizedState>();
    public algorithmStrategy$ = new ReplaySubject<AlgorithmBase>();
    public codeJson$ = new ReplaySubject<CodeJson>();

    private stateManager = new AlgorithmStateManager();

    public setAlgorithm(algorithmStrategy: AlgorithmBase): void {
        this.algorithmStrategy = algorithmStrategy;
        this.algorithmStrategy$.next(this.algorithmStrategy);
        this.codeJson$.next(this.algorithmStrategy.getCodeJson());
        this.stateManager.setAlgorithm(algorithmStrategy);
    }

    public setGraph(graph: Graph = this.graph, rootId: string = this.rootId) {
        this.graph = graph;
        this.rootId = rootId;
        this.graphState$.next(this.graph);
        this.stateManager.setGraph(graph, rootId);
    }

    constructor() {
        this.stateManager.state$.subscribe(state => {
            this.state$.next(state);
        });
        this.stateManager.state$.filter(state => !!state).subscribe(state => {
            this.normalizedState$.next(this.algorithmStrategy.normalize(state.state));
        });
    }

    public algorithmStrategy: AlgorithmBase = new DijkstraShortestPathAlgorithm();

    public updateStateNumber(action: string): void {
        switch (action) {
            case 'next':
                this.stateManager.goToNext();
                break;
            case 'prev':
                this.stateManager.goToPrevious();
                break;
            case 'first':
                this.stateManager.goToFirst();
                break;
            case 'last':
                this.stateManager.goToLast();
                break;
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
        if (nodeId == this.rootId) {
            this.rootId = this.graph.nodes[0].id;
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
        this.graph.nodes.find(node => node.label == nodeLabel).position = position;
        this.setGraph();
    }

    public moveNode(nodeId: string, position: ClickPosition): void {
        this.graph.nodes.find(node => node.id == nodeId).position = position;
        this.setGraph();
    }

}
