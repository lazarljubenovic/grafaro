import {Component, OnInit, Input} from "@angular/core";
import {BreadthFirstSearchService, NormalizedState} from "./breadth-first-search.service";
import {Graph} from "graphlib";

@Component({
    selector: 'grf-breadth-first-search',
    templateUrl: './breadth-first-search.component.html',
    styleUrls: ['./breadth-first-search.component.scss']
})
export class BreadthFirstSearchComponent implements OnInit {

    private _graph: Graph;

    @Input()
    public set graph(graph: Graph) {
        this._graph = graph;
        this.update();
    }

    private _root: string;

    @Input()
    public set root(root: string) {
        this._root = root;
        this.update();
    }

    public states: NormalizedState[] = [];

    private update(): void {
        if (this._root == null || this._graph == null) {
            return;
        }
        const nonNormalizedStates = this.algorithm.getStates(this._graph, this._root);
        console.log(nonNormalizedStates);
        this.states = nonNormalizedStates.map(s => this.algorithm.getNormalizedState(s));
    }

    private currentStateNumber: number = 0;

    public incCurrentStateNumber(): void {
        if (this.currentStateNumber != this.states.length - 1) {
            this.currentStateNumber++;
            this.update();
        }
    }

    public decCurrentStateNumber(): void {
        if (this.currentStateNumber != 0) {
            this.currentStateNumber--;
            this.update();
        }
    }

    constructor(private algorithm: BreadthFirstSearchService) {
    }

    ngOnInit() {

    }

}
