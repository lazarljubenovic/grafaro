import {Component, OnInit, Input, ElementRef} from "@angular/core";

@Component({
    selector: 'grf-tab',
    templateUrl: './tab.component.html',
    styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {

    @Input()
    public tabTitle: string;

    @Input()
    public icon: string;

    constructor(public elementRef: ElementRef) {
    }

    ngOnInit() {
    }

}
