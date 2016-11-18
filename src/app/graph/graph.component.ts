import {Component, OnInit, Input} from '@angular/core';
import {VisNgOptions} from "@lazarljubenovic/vis-ng/esm/core/vis-graph/options.interface";
import {GrfGraphEdgeOptions, GrfGraphNodeOptions} from "./graph.module";

@Component({
    selector: 'grf-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {

    @Input()
    public options: VisNgOptions = {};

    @Input()
    public nodes: GrfGraphNodeOptions[] = [];

    @Input()
    public edges: GrfGraphEdgeOptions[] = [];

    constructor() {
    }

    ngOnInit() {
    }

}
