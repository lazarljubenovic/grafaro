import {Component, OnInit, Input} from "@angular/core";
import {VisNgNetworkOptions} from "@lazarljubenovic/vis-ng/core";
import {GrfGraphEdgeOptions, GrfGraphNodeOptions} from "./graph.module";
import * as deepAssign from 'deep-assign';
import {GraphOptionsService} from "../graph-options.service";

@Component({
    selector: 'grf-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {

    private _defaultOptions: VisNgNetworkOptions = {
        nodes: {
            shadow: {
                enabled: true,
                color: 'rgba(0, 0, 0, .3)',
                size: 5,
                x: 0,
                y: 2,
            }
        },
        edges: {
            smooth: false,
            font: {
                align: 'top',
            }
        },
    };

    private _globalOptions: VisNgNetworkOptions;

    public resultingOptions: VisNgNetworkOptions = {};

    private updateResultingOptions() {
        this.resultingOptions = deepAssign(
            this._defaultOptions,
            this._globalOptions,
        );
    }

    @Input()
    public nodes: GrfGraphNodeOptions[] = [];

    @Input()
    public edges: GrfGraphEdgeOptions[] = [];

    constructor(private graphOptionsService: GraphOptionsService) {
    }

    ngOnInit() {
        this.graphOptionsService.optionsChange$.subscribe(options => {
            this._globalOptions = options;
            this.updateResultingOptions();
        })
    }

}
