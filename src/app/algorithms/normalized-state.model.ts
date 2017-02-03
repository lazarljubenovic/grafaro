import {VisNgNetworkOptionsEdges} from '@lazarljubenovic/vis-ng/core';
import {GrfGraphNodeOptions} from '../graph/graph.module';

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
