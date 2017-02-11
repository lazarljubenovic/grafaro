import {Component, OnInit, OnDestroy} from '@angular/core';
import {DebugTableService} from './debug-table.service';
import {StateManagerObject, AlgorithmStateManager} from '../algorithms/state-manager';

@Component({
    selector: 'grf-debug-table',
    templateUrl: './debug-table.component.html',
    styleUrls: ['./debug-table.component.scss'],
})
export class DebugTableComponent implements OnInit, OnDestroy {

    public debugData: any;

    public trackedVars: string[] = [];

    public state(state: StateManagerObject) {
        if (state != null) {
            this.debugData = state.state.getDebugData();
        }
    }

    public trackBy(index: number, item: any): number {
        return index;
    }

    constructor(private _service: DebugTableService,
                private _stateManager: AlgorithmStateManager) {
    }

    public ngOnInit(): void {
        this._service.visibleVariables$.subscribe(vars => {
            this.trackedVars = vars;
        });

        this._stateManager.state$.subscribe(state => {
            this.debugData = state.state.getDebugData();
        });
    }

    public ngOnDestroy(): void {
        this._service.visibleVariables$.unsubscribe();
    }

}
