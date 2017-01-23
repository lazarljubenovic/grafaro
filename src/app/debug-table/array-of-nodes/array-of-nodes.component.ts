import {Component, OnInit, Input, trigger, state, style, transition, animate} from '@angular/core';

@Component({
    selector: 'grf-array-of-nodes',
    templateUrl: './array-of-nodes.component.html',
    styleUrls: ['../node/node.component.scss', './array-of-nodes.component.scss'],
    animations: [
        trigger('element', [
            state('void', style({
                // transform: 'translateY(-100%)',
                opacity: '0',
                width: '0',
                padding: '0',
            })),
            state('visible', style({
                // transform: 'translateY(0%)',
                opacity: '1',
                width: '18px', // must match with css
                paddingRight: '6px', // must match with css
            })),
            transition('* <=> void', animate('240ms ease-out')),
        ])
    ],
})
export class ArrayOfNodesComponent implements OnInit {

    @Input() public labels: string[];

    constructor() {
    }

    ngOnInit() {
    }

}
