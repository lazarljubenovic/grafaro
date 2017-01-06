import {Component, OnInit, Input} from '@angular/core';
import {RoomInfo} from '../room-info.interface';

@Component({
    selector: 'grf-project-card',
    templateUrl: './project-card.component.html',
    styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {
    // todo rename

    @Input()
    public project: RoomInfo;

    constructor() {
    }

    ngOnInit() {
    }

}
