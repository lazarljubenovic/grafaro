import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {JoinSocketService} from './join.service';
import {RoomInfoSocketService} from './room-info.service';
import {RoomInfo} from './room-info.interface';
import {Router} from '@angular/router';

@Component({
    selector: 'grf-room-browser',
    templateUrl: 'room-browser.component.html',
    styleUrls: ['room-browser.component.scss']
})
export class RoomBrowserComponent implements OnInit {

    /**
     * Stream of room info.
     */
    public roomsInfo$: Observable<RoomInfo[]>;

    constructor(private _joinService: JoinSocketService,
                private _roomInfoSocket: RoomInfoSocketService,
                private _router: Router) {
    }

    /**
     * Subscribe to Join and RoomInfo sockets.
     */
    ngOnInit() {
        // This is happening only when new joinMessage is received
        this._joinService
            .joinSocket$
            .subscribe(joinMessage => {
                // On error, change route to 404
                if (joinMessage.error != '') {
                    this._router.navigate(['/error']);
                    console.log('TODO: better error handling');
                    console.error(joinMessage.error);
                } else {
                    const roomId = joinMessage.roomId;
                    this._joinService.setRoom(roomId);
                    this._router.navigate(['/room', roomId]);
                }
            });

        this.roomsInfo$ = this._roomInfoSocket.roomInfo$
            .map(roomInfoMessage => {
                return roomInfoMessage.info;
            });
    }

    /**
     * Send server request for new room creation.
     */
    public createNewRoom(): void {
        this._joinService.newRoom();
    }

}
