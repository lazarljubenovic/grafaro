import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'grf-node',
    templateUrl: 'debug-value-single.component.html',
    styleUrls: ['debug-value-single.component.scss'],
})
export class NodeComponent implements OnInit {

    @Input() data: {value: any, color: string};

    constructor() {
    }

    ngOnInit() {
    }

}
