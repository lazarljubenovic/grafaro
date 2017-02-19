import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GraphComponent} from './graph.component';
import {VisNetworkModule} from '@lazarljubenovic/vis-ng/core';
import {GraphNodeOptionsTransformPipe} from './graph-node-options-transform.pipe';
import {GraphEdgeOptionsTransformPipe} from './graph-edge-options-transform.pipe';
import {ColorThemeService} from '../color-theme.service';
import {AlgorithmStateManager} from '../algorithms/state-manager';
import {
    AnnotationDecoratorNodeRuleWithText,
    AnnotationDecoratorEdgeRuleWithText
} from '../algorithms/algorithm-base';
import {PopupRenameService} from '../project-view/popup-rename/popup-rename.service';

export interface GrfGraphNodeAnnotationOptions {
    position: string; // 'n' | 'e' | 'w' | 's' | 'ne' | 'nw' | 'se' | 'sw';
    text: string;
    style: string;
}

export enum GrfRole {
    DEFAULT,
    START,
    END,
}

export enum GrfColor {
    DEFAULT,
    DIMMED,
    SECONDARY,
    PRIMARY,
    ACCENT,
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
    annotations: AnnotationDecoratorNodeRuleWithText[];
}

export interface GrfGraphEdgeOptions {
    id: string;
    label: string;
    from: string;
    to: string;
    annotations: AnnotationDecoratorEdgeRuleWithText[];
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
        PopupRenameService,
    ],
})
export class GraphModule {
}
