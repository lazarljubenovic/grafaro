import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'grf-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    @Input()
    public projectTitle: string = 'Untitled';

    @Input()
    public projectDescription: string = `Project Untitled doesn't have a description.`;

    constructor() {
    }

    ngOnInit() {
    }

}
