import {Component, OnInit, AfterViewInit, AfterContentInit} from '@angular/core';
import {Observable} from 'rxjs';
import {AlgorithmService} from '../algorithms/algorithm.service';
import {getCodeJson, CODE} from '../algorithms/breadth-first-search';
import {NotifyService} from './notify.service';

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

    constructor(algorithmService: AlgorithmService,
                private notifyService: NotifyService
    ) {
        this.currentState$ = algorithmService.currentState$;
    }

    ngOnInit() {
        this.code$ = this.currentState$
            .map(state => {
                return getCodeJson(CODE, state);
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
