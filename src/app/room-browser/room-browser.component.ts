import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {RoomInfoSocketService} from './room-info.service';
import {RoomInfo} from './room-info.interface';
import {Router} from '@angular/router';
import {JoinStorageService} from '../shared/join-service/join-storage.service';

@Component({
    selector: 'grf-room-browser',
    templateUrl: 'room-browser.component.html',
    styleUrls: ['room-browser.component.scss']
})
export class RoomBrowserComponent implements OnInit, OnDestroy {

    private _joinSubscription: Subscription;
    /**
     * Stream of room info.
     */
    public roomsInfo$: Observable<RoomInfo[]>;

    constructor(private _joinStorage: JoinStorageService,
                private _roomInfoSocket: RoomInfoSocketService,
                private _router: Router) {
    }

    /**
     * Subscribe to Join and RoomInfo sockets.
     */
    ngOnInit() {
        // Subscribe to incoming Join messages
        this._joinSubscription = this._joinStorage
            .joinMessages$
            .subscribe(joinMessage => {
                // On error, change route to 404
                if (joinMessage.error != '') {
                    this._router.navigate(['/error']);
                    this._joinStorage.setRoom('');
                    console.log('TODO: better error handling');
                    console.error(joinMessage.error);
                } else {
                    // todo remove this maybe? it's already happening in ProjectViewComponent
                    const roomId = joinMessage.roomId;
                    this._joinStorage.setRoom(roomId);
                    this._router.navigate(['/room', roomId]);
                }
            });

        this.roomsInfo$ = this._roomInfoSocket.roomInfo$
            .map(roomInfoMessage => {
                return roomInfoMessage.info;
            });
    }

    ngOnDestroy(): void {
        this._joinSubscription.unsubscribe();
    }

    /**
     * Send server request for new room creation.
     */
    public createNewRoom(): void {
        this._joinStorage.newRoom();
    }

}
