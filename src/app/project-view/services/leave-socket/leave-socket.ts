import {LeaveSocketInterface, LeaveSocketMessage} from './leave-socket.base';
import {WebSocketService} from '../../../websocket.service';

export class LeaveSocket extends LeaveSocketInterface {

    /**
     * Sends leave message.
     * @override
     */
    public leave(): void {
        const leaveMessage: LeaveSocketMessage = {
            roomId: this._webSocketService.roomId,
        };
        this._webSocketService.send(leaveMessage, 'leave');
        this._webSocketService.roomId = '';
    }

    constructor (private _webSocketService: WebSocketService) {
        super();
        // probably it won't be used
        this._webSocketService.subscribeTo('leave')
            .subscribe(message => this.leaveSocket$.next(message));
    }

}
