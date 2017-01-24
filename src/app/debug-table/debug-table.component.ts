import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {DebugTableService} from './debug-table.service';

@Component({
    selector: 'grf-debug-table',
    templateUrl: './debug-table.component.html',
    styleUrls: ['./debug-table.component.scss'],
})
export class DebugTableComponent implements OnInit, OnDestroy {

    private _state: any;

    private _trackedVariables: string[] = [];

    @Input()
    public set state(state: any) {
        // let newState = {};
        // if (state == null) {
        //     this._state = null;
        //     return;
        // }
        // this._trackedVariables.forEach(key => {
        //     const value = state[key];
        //     if (key != 'graphJson' && key != 'lineNumber') {
        //         newState[key] = value;
        //     }
        // });
        this._state = state;
    }

    public get state(): any {
        return this._state;
    }

    public trackBy(index: number, item: any): any {
        return index;
    }

    constructor(private _service: DebugTableService) {
    }

    ngOnInit() {
        this._service.visibleVariables$.subscribe(vars => this._trackedVariables = vars);
    }

    ngOnDestroy() {
        this._service.visibleVariables$.unsubscribe();
    }

}
