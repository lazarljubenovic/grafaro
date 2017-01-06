import {Component, OnInit, Input} from '@angular/core';
import {RoomInfo} from '../room-info.interface';

@Component({
    selector: 'grf-room-card',
    templateUrl: 'room-card.component.html',
    styleUrls: ['room-card.component.scss']
})
export class ProjectCardComponent implements OnInit {
    // todo rename

    @Input()
    public roomInfo: RoomInfo;

    constructor() {
    }

    ngOnInit() {
    }

}
