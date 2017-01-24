import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'grf-node',
    templateUrl: './node.component.html',
    styleUrls: ['./node.component.scss'],
})
export class NodeComponent implements OnInit {

    @Input() data: {value: any, color: string};

    constructor() {
    }

    ngOnInit() {
    }

}
