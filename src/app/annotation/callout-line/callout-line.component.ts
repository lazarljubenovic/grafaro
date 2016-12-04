import {Component, OnInit, Input, ChangeDetectionStrategy, OnChanges} from '@angular/core';
import {CalloutLineService} from './callout-line.service';

@Component({
    selector: 'grf-callout-line',
    templateUrl: './callout-line.component.html',
    styleUrls: ['./callout-line.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalloutLineComponent implements OnInit, OnChanges {

    @Input() public dangerZone: HTMLElement;
    @Input() public from: {x: number, y: number};
    @Input() public to: {x: number, y: number};
    public points: {x: number, y: number}[];

    ngOnChanges() {
        const rect = this.dangerZone.getBoundingClientRect();
        const topLeft = {x: rect.left, y: rect.top};
        const bottomRight = {x: rect.right, y: rect.bottom};
        this.points = this.service.getPoints(this.from, this.to, {
            topLeft,
            bottomRight
        });
    }

    constructor(private service: CalloutLineService) {
    }

    ngOnInit() {
    }

}
