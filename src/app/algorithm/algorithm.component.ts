import {Component, OnInit} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {BreadthFirstSearchService} from "../breadth-first-search/breadth-first-search.service";

@Component({
    selector: 'grf-algorithm',
    templateUrl: './algorithm.component.html',
    styleUrls: ['./algorithm.component.scss']
})
export class AlgorithmComponent implements OnInit {

    private currentState$: Observable<any>;

    public varSolution$: Observable<string[]>;
    public varQueue$;
    public varRoot$;
    public varVisited$;
    public varNeighbors$;
    public varCurrentNode$;
    public varCurrentNeighbor$;

    public lineNumber$: Observable<number>;

    public mockArray = ['A', 'B', 'C', 'D'];
    public highlights = ['B', 'C'];

    public isOpenSolution$ = new BehaviorSubject<boolean>(false);
    public isOpenQueue$ = new BehaviorSubject<boolean>(false);
    public isOpenRoot$ = new BehaviorSubject<boolean>(false);
    public isOpenVisited$ = new BehaviorSubject<boolean>(false);
    public isOpenNeighbors$ = new BehaviorSubject<boolean>(false);
    public isOpenCurrentNode$ = new BehaviorSubject<boolean>(false);
    public isOpenCurrentNeighbor$ = new BehaviorSubject<boolean>(false);

    public removeFromArray(item: string): void {
        this.mockArray = this.mockArray.filter(e => e != item);
    }

    constructor(graphService: BreadthFirstSearchService) {
        this.currentState$ = graphService.currentState$;
    }

    ngOnInit() {
        this.varSolution$ = this.currentState$.map(state => state.currentSolution);
        this.varQueue$ = this.currentState$.map(state => state.currentQueue);
        this.varRoot$ = this.currentState$.map(state => state.rootNode);
        this.varVisited$ = this.currentState$.map(state => state.visitedNodes);
        this.varNeighbors$ = this.currentState$.map(state => state.currentNodeNeighbors);
        this.varCurrentNode$ = this.currentState$.map(state => state.currentNode);
        this.varCurrentNeighbor$ = this.currentState$.map(state => state.currentNeighbor);
        this.lineNumber$ = this.currentState$.map(state => state.lineNumber);
    }

}
