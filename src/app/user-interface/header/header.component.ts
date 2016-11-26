import {Component, OnInit, Input} from "@angular/core";

@Component({
    selector: 'grf-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    @Input()
    public projectName: string = 'Untitled';

    constructor() {
    }

    ngOnInit() {
    }

}
