import {Component, OnInit, AfterViewInit, AfterContentInit} from '@angular/core';
import {Observable} from 'rxjs';
import {AlgorithmService} from '../algorithms/algorithm.service';
import {NotifyService} from './notify.service';
import {DepthFirstSearchAlgorithm} from '../algorithms/depth-first-search';

@Component({
    selector: 'grf-algorithm',
    templateUrl: './algorithm.component.html',
    styleUrls: ['./algorithm.component.scss'],
})
export class AlgorithmComponent implements OnInit, AfterViewInit, AfterContentInit {

    public code$;

    private currentState$: Observable<any>;

    public lineNumber$: Observable<number>;

    public toggle() {
    }

    public trackByIndex(index, item) {
        return index;
    }

    constructor(private algorithmService: AlgorithmService,
                private notifyService: NotifyService) {
        algorithmService.setAlgorithm(new DepthFirstSearchAlgorithm());
        this.currentState$ = algorithmService.currentState$;
    }

    ngOnInit() {
        this.code$ = this.currentState$
            .map(state => {
                return  this.algorithmService.getCodeJson();
            });

        this.lineNumber$ = this.currentState$.map(state => state.lineNumber);

        this.currentState$.subscribe(state => {
            this.notifyService.stateChange$.next(true);
        });
    }

    ngAfterViewInit() {
        console.log('algorithm: after view int');
    }

    ngAfterContentInit() {
        console.log('algorithm: after content init');
    }

}
