import {Component, OnInit, Input} from '@angular/core';
import {Project} from '../project';

@Component({
    selector: 'grf-project-card',
    templateUrl: './project-card.component.html',
    styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {

    @Input()
    public project: Project;

    constructor() {
    }

    ngOnInit() {
    }

}
