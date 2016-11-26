import {Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef} from "@angular/core";
import {BreadthFirstSearchService, NormalizedState} from "./breadth-first-search.service";
import {Graph} from "graphlib";
import {VisNgNetworkEventArgument} from "@lazarljubenovic/vis-ng/core";

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

    @Output() public graphClick = new EventEmitter<VisNgNetworkEventArgument>();

    public states: NormalizedState[] = [];

    public stateNumber: number = 0;

    public update(): void {
        if (this._root == null || this._graph == null) {
            return;
        }
        const nonNormalizedStates = this.algorithm.getStates(this._graph, this._root);
        this.states = nonNormalizedStates.map(s => this.algorithm.getNormalizedState(s));
    }

    public updateStateNumber(action: string): void {
        switch (action) {
            case 'next':
                this.goToNext();
                break;
            case 'prev':
                this.goToPrev();
                break;
            case 'first':
                this.goToFirst();
                break;
            case 'last':
                this.goToLast();
                break;
        }
        this.update();
    }

    private goToNext(): void {
        if (this.stateNumber != this.states.length - 1) {
            this.stateNumber++;
        }
    }

    private  goToPrev(): void {
        if (this.stateNumber != 0) {
            this.stateNumber--;
        }
    }

    private goToLast(): void {
        this.stateNumber = 0;
    }

    private goToFirst(): void {
        this.stateNumber = this.states.length - 1;
    }

    public onGraphClick(event: VisNgNetworkEventArgument): void {
        this.graphClick.emit(event);
    }

    constructor(private algorithm: BreadthFirstSearchService,
                public changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit() {

    }

}
