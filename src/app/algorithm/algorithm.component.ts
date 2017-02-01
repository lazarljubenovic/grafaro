import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {AlgorithmService} from '../algorithms/algorithm.service';
import {NotifyService} from './notify.service';
import {DebugTableService} from '../debug-table/debug-table.service';
import {DijkstraShortestPathAlgorithm} from '../algorithms/dijkstra-shortest-path';
import {CodeJson} from '../algorithms/algorithm-base';
import {StateManagerObject} from '../algorithms/state-manager';

@Component({
    selector: 'grf-algorithm',
    templateUrl: './algorithm.component.html',
    styleUrls: ['./algorithm.component.scss'],
})
export class AlgorithmComponent implements OnInit {

    public code$: Observable<CodeJson>;

    private currentState$: Observable<StateManagerObject>;

    public lineNumber$: Observable<number>;

    public toggle() {
    }

    public trackByIndex(index, item) {
        return index;
    }

    constructor(private algorithmService: AlgorithmService,
                private notifyService: NotifyService,
                private debugTableService: DebugTableService) {
        algorithmService.setAlgorithm(new DijkstraShortestPathAlgorithm()); // init algorithm
        this.currentState$ = algorithmService.state$;
    }

    public toggleTrackedVariableVisibility(varName: string): void {
        this.debugTableService.toggleVariable(varName);
    }

    ngOnInit() {
        this.code$ = this.algorithmService.codeJson$;

        this.lineNumber$ = this.currentState$
            .filter(state => !!state)
            .map(state => state.index);

        this.currentState$.subscribe(state => {
            this.notifyService.stateChange$.next(true);
        });
    }

}
