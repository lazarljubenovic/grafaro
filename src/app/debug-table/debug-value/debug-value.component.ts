import {Component, Input, ChangeDetectionStrategy, OnChanges} from '@angular/core';

@Component({
    selector: 'grf-debug-value',
    templateUrl: './debug-value.component.html',
    styleUrls: ['./debug-value.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebugValueComponent implements OnChanges {

    @Input() data: any;

    public isSingleValue: boolean;
    public isArray: boolean;

    constructor() {
    }

    ngOnChanges() {
        if (this.data == null) {
            this.isSingleValue = true;
            return;
        }
        this.isArray = Array.isArray(this.data);
        this.isSingleValue = !this.isArray;
    }

}
