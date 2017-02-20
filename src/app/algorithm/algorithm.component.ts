import {Component, OnInit, OnDestroy} from '@angular/core';
import {DebugTableService} from '../debug-table/debug-table.service';
import {CodeJson} from '../algorithms/algorithm-base';
import {AlgorithmStateManager} from '../algorithms/state-manager';
import {Subject} from 'rxjs';

@Component({
    selector: 'grf-algorithm',
    templateUrl: './algorithm.component.html',
    styleUrls: ['./algorithm.component.scss'],
})
export class AlgorithmComponent implements OnInit, OnDestroy {

    private _destroySubject = new Subject<boolean>();
    public code: CodeJson;

    public lineNumber: number;

    public trackByIndex(index: number, item: any) {
        return index;
    }

    constructor(private stateManager: AlgorithmStateManager,
                private debugTableService: DebugTableService) {
    }

    public toggleTrackedVariableVisibility(varName: string): void {
        this.debugTableService.toggleVariable(varName);
    }

    ngOnInit() {
        this.stateManager.state$
            .takeUntil(this._destroySubject)
            .subscribe(state => {
                // todo this can be read from AlgorithmManager
                this.code = this.stateManager.getAlgorithm().getCodeJson();
                this.lineNumber = state.state.lineNumber;
            });
    }

    ngOnDestroy() {
        this._destroySubject.next(true);
        this._destroySubject.unsubscribe();
    }

}
