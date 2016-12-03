import {Component, OnInit, ChangeDetectionStrategy} from "@angular/core";

@Component({
    selector: 'grf-empty',
    template: `<span class="icon">×</span><span>(empty)</span>`,
    styleUrls: ['./empty.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

}
