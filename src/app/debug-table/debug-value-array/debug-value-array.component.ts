import {Component, OnInit, Input, trigger, state, style, transition, animate} from '@angular/core';
import {DebugDataValue} from '../../algorithms/algorithm-base';

@Component({
    selector: 'grf-array-of-nodes',
    templateUrl: 'debug-value-array.component.html',
    styleUrls: ['debug-value-array.component.scss'],
    animations: [
        trigger('element', [
            state('void', style({
                transform: 'translateY(-100%)',
                opacity: '0',
                width: '0',
                padding: '0',
            })),
            state('visible', style({
                transform: 'translateY(0%)',
                opacity: '1',
                width: '18px', // must match with css
                paddingRight: '6px', // must match with css
            })),
            transition('* <=> void', animate('240ms ease-out')),
        ])
    ],
})
export class ArrayOfNodesComponent implements OnInit {

    @Input() public data: DebugDataValue[];

    public track(index: number, item: DebugDataValue) {
        if (Array.isArray(item.value)) {
            return item.value[0];
        } else {
            return item.value;
        }
    }

    constructor() {
    }

    ngOnInit() {
    }

}
