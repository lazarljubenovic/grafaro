import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GraphComponent} from './graph.component';
import {VisNetworkModule} from '@lazarljubenovic/vis-ng/core';
import {GraphNodeOptionsTransformPipe} from './graph-node-options-transform.pipe';
import {GraphEdgeOptionsTransformPipe} from './graph-edge-options-transform.pipe';
import {ColorThemeService} from '../color-theme.service';
import {AlgorithmStateManager} from '../algorithms/state-manager';

export interface GrfGraphNodeAnnotationOptions {
    position: string; // 'n' | 'e' | 'w' | 's' | 'ne' | 'nw' | 'se' | 'sw';
    text: string;
    style: string;
}

export enum GrfRole {
    START,
    END,
    DEFAULT,
}

export enum GrfColor {
    ACCENT,
    PRIMARY,
    SECONDARY,
    DEFAULT,
    DIMMED,
}

export interface GrfGraphNodeOptions {
    id: string;
    label: string;
    position: {
        x: number;
        y: number;
    };
    role: GrfRole;
    color: GrfColor;
    annotations: GrfGraphNodeAnnotationOptions[];
}

export interface GrfGraphEdgeOptions {
    id: string;
    label: string;
    from: string;
    to: string;
}

@NgModule({
    imports: [
        CommonModule,
        VisNetworkModule.forRoot(),
    ],
    declarations: [
        GraphComponent,
        GraphNodeOptionsTransformPipe,
        GraphEdgeOptionsTransformPipe,
    ],
    exports: [
        GraphComponent,
    ],
    providers: [
        ColorThemeService,
        AlgorithmStateManager,
    ],
})
export class GraphModule {
}
