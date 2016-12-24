import {
    Component,
    OnInit,
    Input,
    trigger,
    state,
    style,
    transition,
    animate,
    ChangeDetectionStrategy,
    OnChanges
} from '@angular/core';

@Component({
    selector: 'grf-array',
    templateUrl: 'array.component.html',
    styleUrls: ['array.component.scss'],
    animations: [
        trigger('element', [
            state('void', style({
                transform: 'translateY(-200%)',
                opacity: '0',
                width: '0',
                padding: '0',
            })),
            state('visible', style({
                transform: 'translateY(0%)',
                opacity: '1',
                width: '36px',
                paddingRight: '9px',
            })),
            transition('* <=> void', animate('360ms ease-out')),
        ])
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrayComponent implements OnInit, OnChanges {

    @Input() public array: string[] = [];
    @Input() public highlightedLetters: string[] = [];

    ngOnChanges() {
        if (this.array == null) {
            this.array = [];
        }
        if (this.array.length == 1 && this.array[0] == null) {
            this.array = [];
        }
    }

    constructor() {
    }

    ngOnInit() {
    }

}
