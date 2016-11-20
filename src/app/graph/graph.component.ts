import {Component, OnInit, Input} from "@angular/core";
import {VisNgNetworkOptions} from "@lazarljubenovic/vis-ng/core";
import {GrfGraphEdgeOptions, GrfGraphNodeOptions} from "./graph.module";

@Component({
    selector: 'grf-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {

    @Input()
    public options: VisNgNetworkOptions = {
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
        }
    };

    @Input()
    public nodes: GrfGraphNodeOptions[] = [];

    @Input()
    public edges: GrfGraphEdgeOptions[] = [];

    constructor() {
    }

    ngOnInit() {
    }

}
