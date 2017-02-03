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

    constructor(private stateManager: AlgorithmStateManager) {
        this.stateManager.state$.subscribe(state => {
            this.state$.next(state);
        });
        this.stateManager.state$.filter(state => !!state).subscribe(state => {
            this.normalizedState$.next(this.algorithmStrategy.normalize(state.state));
        });
    }

    public algorithmStrategy: AlgorithmBase = new DijkstraShortestPathAlgorithm();

}
