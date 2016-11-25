import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'grf-matrix',
    templateUrl: './matrix.component.html',
    styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent implements OnInit {

    @Input() public data: any[][];
    @Input() public rowLabels: string[];
    @Input() public colLabels: string[];

    constructor() {
    }

    ngOnInit() {
    }

}
