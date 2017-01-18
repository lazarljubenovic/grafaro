import {
    Component,
    trigger,
    state,
    style,
    transition,
    animate,
    ChangeDetectorRef
} from '@angular/core';
import {AnnotationBase} from '../annotation-base';

@Component({
    selector: 'grf-array',
    templateUrl: 'array.component.html',
    styleUrls: ['./array.component.scss'],
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
})
export class ArrayComponent extends AnnotationBase {

    public value: string[] = [];
    public highlightedLetters: string[] = [];

    onChange() {
        if (this.value == null) {
            this.value = [];
        }
        if (this.value.length == 1 && this.value[0] == null) {
            this.value = [];
        }
        this.cdr.detectChanges();
    }

    constructor(cdr: ChangeDetectorRef) {
        super(cdr);
    }

}
