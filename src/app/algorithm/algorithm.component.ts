import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {AlgorithmService} from '../algorithms/algorithm.service';
import {NotifyService} from './notify.service';
import {DebugTableService} from '../debug-table/debug-table.service';
import {DepthFirstSearchAlgorithm} from '../algorithms/depth-first-search';

@Component({
    selector: 'grf-algorithm',
    templateUrl: './algorithm.component.html',
    styleUrls: ['./algorithm.component.scss'],
})
export class AlgorithmComponent implements OnInit {

    public code$;

    private currentState$: Observable<any>;

    public lineNumber$: Observable<number>;

    public toggle() {
    }

    public trackByIndex(index, item) {
        return index;
    }

    constructor(private algorithmService: AlgorithmService,
                private notifyService: NotifyService,
                private debugTableService: DebugTableService) {
        algorithmService.setAlgorithm(new DepthFirstSearchAlgorithm()); // init algorithm
        this.currentState$ = algorithmService.currentState$;
    }

    public toggleTrackedVariableVisibility(varName: string): void {
        this.debugTableService.toggleVariable(varName);
    }

    ngOnInit() {
        this.code$ = this.currentState$
            .map(state => {
                return this.algorithmService.getCodeJson();
            });

        this.lineNumber$ = this.currentState$.map(state => state.lineNumber);

        this.currentState$.subscribe(state => {
            this.notifyService.stateChange$.next(true);
        });
    }

}
