import {Injectable} from '@angular/core';
import {LeaveSocketInterface} from './leave-socket.base';
import {LeaveSocket} from './leave-socket';
import {MockLeaveSocket} from './mock-leave-socket';
import {WebSocketService} from '../../../websocket.service';

@Injectable()
export class LeaveStorageService {
    /**
     * Source for leave messages.
     * @private
     * @type {LeaveSocketInterface}
     */
    private _leaveSource: LeaveSocketInterface;

    constructor(private _webSocketService: WebSocketService) {
        this._webSocketService.socketStatus.subscribe(status => {
            if (status) {
                this._leaveSource = new LeaveSocket(this._webSocketService);
            } else {
                this._leaveSource = new MockLeaveSocket();
            }
        });
    }

    public leave() {
        this._leaveSource.leave();
    }

}
