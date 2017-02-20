import {Component, Output, EventEmitter, Inject, forwardRef, OnDestroy} from '@angular/core';
import {ToolbarService} from './toolbar.service';

export interface ClickPosition {
    x: number;
    y: number;
}

export enum Actions {
    select,
    add,
    remove,
    connect,
    disconnect,
    rename,
    weight,
}

@Component({
    selector: 'grf-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnDestroy {

    public currentSelected: number = 0;

    @Output() public load = new EventEmitter<void>();
    @Output() public save = new EventEmitter<void>();

    public tools = [
        {
            icon: 'fa-mouse-pointer',
            name: 'Pointer',
            action: Actions.select,
        },
        {
            icon: 'fa-plus',
            name: 'Add',
            action: Actions.add,
        },
        {
            icon: 'fa-minus',
            name: 'Remove',
            action: Actions.remove,
        },
        {
            icon: 'fa-chain',
            name: 'Connect',
            action: Actions.connect,
        },
        {
            icon: 'fa-chain-broken',
            name: 'Disconnect',
            action: Actions.disconnect,
        },
        {
            icon: 'fa-font',
            name: 'Rename',
            action: Actions.rename,
        },
        {
            icon: 'fa-balance-scale',
            name: 'Weight',
            action: Actions.weight,
        }
    ];

    public toolSelected(tool: any) {
        this.currentSelected = tool.action;
        this._toolbarService.chooseTool$.next(tool.action);
    }

    constructor(@Inject(forwardRef(() => ToolbarService)) private _toolbarService: ToolbarService) {
    }

    ngOnDestroy() {
        this._toolbarService.chooseTool$.next(Actions.select);
    }

}
