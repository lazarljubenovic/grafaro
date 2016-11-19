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
    public options: VisNgNetworkOptions = {};

    @Input()
    public nodes: GrfGraphNodeOptions[] = [];

    @Input()
    public edges: GrfGraphEdgeOptions[] = [];

    constructor() {
    }

    ngOnInit() {
    }

}
