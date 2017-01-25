import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {DebugTableService} from './debug-table.service';

@Component({
    selector: 'grf-debug-table',
    templateUrl: './debug-table.component.html',
    styleUrls: ['./debug-table.component.scss'],
})
export class DebugTableComponent implements OnInit, OnDestroy {

    public debugData: any;

    public trackedVars: string[] = [];

    @Input()
    public set state(state: any) {
        if (state != null) {
            this.debugData = state.getDebugData();
        }
    }

    public trackBy(index: number, item: any): any {
        return index;
    }

    constructor(private _service: DebugTableService) {
    }

    ngOnInit() {
        this._service.visibleVariables$.subscribe(vars => this.trackedVars = vars);
    }

    ngOnDestroy() {
        this._service.visibleVariables$.unsubscribe();
    }

}
