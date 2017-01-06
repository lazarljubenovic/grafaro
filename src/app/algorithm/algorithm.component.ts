import {Component, OnInit, AfterViewInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AlgorithmService} from '../algorithms/algorithm.service';

@Component({
    selector: 'grf-algorithm',
    templateUrl: './algorithm.component.html',
    styleUrls: ['./algorithm.component.scss'],
})
export class AlgorithmComponent implements OnInit, AfterViewInit {

    private currentState$: Observable<any>;

    public varSolution$: Observable<string[]>;
    public varQueue$;
    public varRoot$;
    public varVisited$;
    public varNeighbors$;
    public varCurrentNode$;
    public varCurrentNeighbor$;
    public lineNumber$: Observable<number>;

    public isOpenSolution$ = new BehaviorSubject<boolean>(false);
    public isOpenQueue$ = new BehaviorSubject<boolean>(false);
    public isOpenRoot$ = new BehaviorSubject<boolean>(false);
    public isOpenVisited$ = new BehaviorSubject<boolean>(false);
    public isOpenNeighbors$ = new BehaviorSubject<boolean>(false);
    public isOpenCurrentNode$ = new BehaviorSubject<boolean>(false);
    public isOpenCurrentNeighbor$ = new BehaviorSubject<boolean>(false);

    constructor(algorithmService: AlgorithmService) {
        this.currentState$ = algorithmService.currentState$;
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

    ngAfterViewInit() {
        setTimeout(() => {
            this.isOpenSolution$.next(true);
            this.isOpenQueue$.next(true);
            this.isOpenRoot$.next(true);
            this.isOpenVisited$.next(true);
            this.isOpenNeighbors$.next(true);
            this.isOpenCurrentNode$.next(true);
            this.isOpenCurrentNeighbor$.next(true);
        });
    }

}
