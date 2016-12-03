import {Component, OnInit, Input, ChangeDetectionStrategy} from "@angular/core";

@Component({
    selector: 'grf-polyline',
    templateUrl: './polyline.component.html',
    styleUrls: ['./polyline.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolylineComponent implements OnInit {

    @Input() public width: number;
    @Input() public color: string;
    @Input() public points: {x: number, y: number}[];

    constructor() {
    }

    ngOnInit() {
    }

}
