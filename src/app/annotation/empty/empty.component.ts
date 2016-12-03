import {Component, OnInit} from "@angular/core";

@Component({
    selector: 'grf-empty',
    template: `<span class="icon">×</span><span>(empty)</span>`,
    styleUrls: ['./empty.component.scss']
})
export class EmptyComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

}
