import {Component, OnInit} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {BreadthFirstSearchService} from "../breadth-first-search/breadth-first-search.service";

@Component({
    selector: 'grf-algorithm',
    templateUrl: './algorithm.component.html',
    styleUrls: ['./algorithm.component.scss']
})
export class AlgorithmComponent implements OnInit {

    public varSolution$: Observable<string[]>;

    public lineNumber = 0;

    public mockArray = ['A', 'B', 'C', 'D'];
    public highlights = ['B', 'C'];

    public visitedOpen = new BehaviorSubject<boolean>(false);

    public removeFromArray(item: string): void {
        this.mockArray = this.mockArray.filter(e => e != item);
    }

    public randomLineNumber() {
        this.lineNumber = Math.floor(Math.random() * 12 + 1);
    }

    constructor(public graphService: BreadthFirstSearchService) {
    }

    ngOnInit() {
        this.varSolution$ = this.graphService.currentState$
            .map(state => state.solution);
    }

}
