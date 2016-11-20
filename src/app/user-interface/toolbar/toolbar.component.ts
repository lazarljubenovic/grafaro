import {Component, OnInit, Input} from "@angular/core";

@Component({
    selector: 'grf-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

    @Input()
    public currentSelected: number = 0;

    public tools = [
        {
            icon: 'fa-mouse-pointer',
            name: 'Pointer',
        },
        {
            icon: 'fa-plus',
            name: 'Add',
        },
        {
            icon: 'fa-minus',
            name: 'Remove',
        },
        {
            icon: 'fa-trash',
            name: 'Delete All',
        },
        {
            icon: 'fa-chain',
            name: 'Whatever',
        },
    ];

    constructor() {
    }

    ngOnInit() {
    }

}
