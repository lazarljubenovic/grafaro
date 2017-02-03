import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {VisNgNetworkOptions, VisNgNetworkEventArgument} from '@lazarljubenovic/vis-ng/core';
import {GrfGraphEdgeOptions, GrfGraphNodeOptions} from './graph.module';
import * as deepAssign from 'deep-assign';
import {GraphOptionsService} from '../graph-options.service';
import {VisNetworkComponent} from '@lazarljubenovic/vis-ng/core/vis-network/vis-network.component';
import {ToolbarService} from '../project-view/toolbar/toolbar.service';
import {AlgorithmStateManager} from '../algorithms/state-manager';

@Component({
    selector: 'grf-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit {

    @ViewChild('network') public visNetworkComponentInstance: VisNetworkComponent;

    public nodes: GrfGraphNodeOptions[] = [];
    public edges: GrfGraphEdgeOptions[] = [];

    public graphNodeDragEnd = new EventEmitter<VisNgNetworkEventArgument>();

    private _defaultOptions: VisNgNetworkOptions = {
        nodes: {
            shadow: {
                enabled: true,
                color: 'rgba(0, 0, 0, .3)',
                size: 5,
                x: 0,
                y: 2,
            },
        },
        edges: {
            smooth: false,
            font: {
                align: 'top',
            },
        },
    };

    private _globalOptions: VisNgNetworkOptions;

    public resultingOptions: VisNgNetworkOptions = {};

    private updateResultingOptions() {
        this.resultingOptions = deepAssign(
            this._defaultOptions,
            this._globalOptions,
        );
        this.resultingOptions = Object.assign({}, this.resultingOptions);
    }

    public onGraphClick(event: VisNgNetworkEventArgument): void {
        this._toolbarService.click$.next(event);
    }

    public onMoveNode(arg: VisNgNetworkEventArgument) {
        const nodeId = <string>arg.nodes[0];
        const position = arg.pointer.canvas;

        this._toolbarService.moveNode$.next({nodeId, position});
    }

    public onGraphDragEnd(event: VisNgNetworkEventArgument): void {
        if (event.nodes.length != 0) {
            this.onMoveNode(event);
        }
    }

    constructor(private graphOptionsService: GraphOptionsService,
                private _toolbarService: ToolbarService,
                private _stateManager: AlgorithmStateManager
    ) {
    }

    ngOnInit() {
        this.graphOptionsService.optionsChange$.subscribe(options => {
            this._globalOptions = options;
            this.updateResultingOptions();
        });

        this._stateManager.state$.subscribe(state => {
            const normalizedState = this._stateManager.getNormalizedState();
            this.nodes = normalizedState.nodes;
            this.edges = <any>normalizedState.edges;
        });
    }

    public dragging(event: VisNgNetworkEventArgument): void {
        // todo maybe?
        // console.log(event);
    }

    public afterDrawing(ctx: CanvasRenderingContext2D) {
        if (this.nodes) {
            this.nodes.forEach(node => {
                if (node.annotations) {
                    node.annotations.forEach(annotation => {
                        ctx.save();
                        const network = this.visNetworkComponentInstance.rawNetworkInstance;
                        const nodePos = network.getPositions([node.id])[node.id];
                        if (nodePos) {
                            ctx.translate(nodePos.x, nodePos.y);
                            const offset = 20;
                            let x: number = 0, y: number = 0;
                            ctx.textBaseline = 'center';
                            ctx.textAlign = 'center';
                            if (annotation.position.includes('s')) {
                                y += offset;
                                ctx.textBaseline = 'top';
                            }
                            if (annotation.position.includes('n')) {
                                y -= offset;
                                ctx.textBaseline = 'bottom';
                            }
                            if (annotation.position.includes('e')) {
                                x += offset;
                                ctx.textAlign = 'left';
                            }
                            if (annotation.position.includes('w')) {
                                x -= offset;
                                ctx.textAlign = 'right';
                            }
                            ctx.fillStyle = annotation.style;
                            ctx.fillText(annotation.text, x, y);
                            ctx.beginPath();
                            ctx.arc(x, y, 2, 0, Math.PI * 2);
                            ctx.stroke();
                            ctx.closePath();
                            ctx.restore();
                        }
                    });
                }
            });
        }
    }

}
