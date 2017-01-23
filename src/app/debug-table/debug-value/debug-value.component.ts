import {Component, Input, ChangeDetectionStrategy, OnChanges} from '@angular/core';

@Component({
    selector: 'grf-debug-value',
    templateUrl: './debug-value.component.html',
    styleUrls: ['./debug-value.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebugValueComponent implements OnChanges {

    @Input() value: any;

    public isSingleValue: boolean;
    public isArray: boolean;

    constructor() {
    }

    ngOnChanges() {
        if (this.value == null) {
            this.isSingleValue = true;
            return;
        }
        this.isSingleValue = typeof this.value == 'string' || this.value == 'number';
        this.isArray = typeof this.value == 'object' && typeof this.value.length == 'number';
    }

}
