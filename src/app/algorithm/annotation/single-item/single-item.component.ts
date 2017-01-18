import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {AnnotationBase} from '../annotation-base';

@Component({
    selector: 'grf-single-item',
    template: `<grf-annotation [algorithm]="box" [snippet]="snippet">
<grf-null *ngIf="!value"></grf-null>
<div *ngIf="value">{{value}}</div>
</grf-annotation>`,
    styleUrls: ['./single-item.component.scss'],
})
export class SingleItemComponent extends AnnotationBase implements OnInit {

    public value: string;

    onChange() {
        this.cdr.detectChanges();
    }

    ngOnInit() {
    }

    constructor(cdr: ChangeDetectorRef) {
        super(cdr);
    }

}
