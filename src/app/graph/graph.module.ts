import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GraphComponent} from './graph.component';
import {VisNetworkModule} from '@lazarljubenovic/vis-ng/core';
import {GraphNodeOptionsTransformPipe} from './graph-node-options-transform.pipe';
import {GraphEdgeOptionsTransformPipe} from './graph-edge-options-transform.pipe';

export interface GrfGraphNodeOptions {
    label: string;
    state: string;
    isStart: boolean;
    isEnd: boolean;
}

export interface GrfGraphEdgeOptions {
    label: string;
    from: string;
    to: string;
}

@NgModule({
    imports: [
        CommonModule,
        VisNetworkModule,
    ],
    declarations: [
        GraphComponent,
        GraphNodeOptionsTransformPipe,
        GraphEdgeOptionsTransformPipe,
    ],
    exports: [
        GraphComponent,
    ],
})
export class GraphModule {
}
