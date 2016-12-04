import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'grf-single-item',
    template: `<grf-null *ngIf="!item"></grf-null><div *ngIf="item">{{item}}</div>`,
    styleUrls: ['./single-item.component.scss'],
})
export class SingleItemComponent implements OnInit {

    @Input() public item: string;

    constructor() {
    }

    ngOnInit() {
    }

}
