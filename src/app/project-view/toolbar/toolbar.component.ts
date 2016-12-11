import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

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
}

@Component({
    selector: 'grf-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

    @Input()
    public currentSelected: number = 0;

    @Output()
    public currentSelectedChange = new EventEmitter<Actions>();

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
    ];

    constructor() {
    }

    ngOnInit() {
    }

}
