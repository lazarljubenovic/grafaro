import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'grf-debug-table',
    templateUrl: './debug-table.component.html',
    styleUrls: ['./debug-table.component.scss'],
})
export class DebugTableComponent implements OnInit {

    private _state: any;

    @Input()
    public set state(state: any) {
        let newState = {};
        if (state == null) {
            this._state = null;
            return;
        }
        Object.keys(state).forEach(key => {
            const value = state[key];
            if (key != 'graphJson' && key != 'lineNumber') {
                newState[key] = value;
            }
        });
        this._state = newState;
    }

    public get state(): any {
        return this._state;
    }

    public trackBy(index: number, item: any): any {
        return index;
    }

    constructor() {
    }

    ngOnInit() {
    }

}
