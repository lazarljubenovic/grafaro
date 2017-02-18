import {Component, OnInit, EventEmitter, ViewChild} from '@angular/core';
import {VisNgNetworkOptions, VisNgNetworkEventArgument} from '@lazarljubenovic/vis-ng/core';
import {GrfGraphEdgeOptions, GrfGraphNodeOptions} from './graph.module';
import * as deepAssign from 'deep-assign';
import {GraphOptionsService} from '../graph-options.service';
import {VisNetworkComponent} from '@lazarljubenovic/vis-ng/core/vis-network/vis-network.component';
import {ToolbarService} from '../project-view/toolbar/toolbar.service';
import {AlgorithmStateManager} from '../algorithms/state-manager';
import {getPointAtRatio} from '../utils/get-point-at-ratio';

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
                align: 'middle',
            },
            color: {
                inherit: false,
            },
        },
        interaction: {
            selectConnectedEdges: false,
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
                private _stateManager: AlgorithmStateManager) {
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

                            ctx.textBaseline = 'center';
                            ctx.textAlign = 'center';

                            const {r, phi} = annotation.position;
                            const x = r * Math.cos(phi * 0.0174533);
                            const y = r * Math.sin(phi * 0.0174533);

                            ctx.font = annotation.font;
                            ctx.lineWidth = 2;
                            ctx.strokeStyle = 'white';
                            ctx.strokeText(annotation.text, x, y);
                            ctx.fillStyle = annotation.style;
                            ctx.fillText(annotation.text, x, y);
                        }
                        ctx.restore();
                    });
                }
            });
        }

        if (this.edges) {
            this.edges.forEach(edge => {
                if (edge.annotations) {
                    edge.annotations.forEach(annotation => {
                        ctx.save();
                        const network = this.visNetworkComponentInstance.rawNetworkInstance;
                        const nodePositions: any = network.getPositions([edge.from, edge.to]);
                        if (nodePositions) {
                            const {x: x1, y: y1} = nodePositions[edge.from];
                            const {x: x2, y: y2} = nodePositions[edge.to];

                            const getAt = getPointAtRatio.bind(null, x1, y1, x2, y2);

                            const ratio = .25;
                            let pos: {x: number, y: number};
                            if (annotation.side == 'from') {
                                pos = getAt(ratio);
                            } else if (annotation.side == 'to') {
                                pos = getAt(1 - ratio);
                            } else {
                                throw new Error(`Edge annotation's side cannot be ` +
                                    `${annotation.side}; it must be 'from' or 'to'`);
                            }
                            const {x, y} = pos;

                            ctx.font = annotation.font;
                            ctx.textBaseline = 'center';
                            ctx.textAlign = 'center';
                            ctx.lineWidth = 2;
                            ctx.strokeStyle = 'white';
                            ctx.strokeText(annotation.text, x, y);
                            ctx.fillStyle = annotation.style;
                            ctx.fillText(annotation.text, x, y);
                        }
                        ctx.restore();
                    });
                }
            });
        }
    }

}
