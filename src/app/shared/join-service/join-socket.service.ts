import {Injectable} from '@angular/core';
import {WebSocketService} from '../../websocket.service';
import {JoinSocketInterface} from './join-socket';

export interface JoinMessageInfo {
    roomId: string;
    error: string;
}

/**
 * Real producer class for sending Join messages to a web socket.
 */
@Injectable()
export class JoinSocketService extends JoinSocketInterface {

    /**
     * @param _webSocketService
     */
    constructor(private _webSocketService: WebSocketService) {
        super();
        this._webSocketService.subscribeTo('join')
            .subscribe(message => this.joinSocket$.next(message));
    }

    /**
     * This function sends an empty Create message to server, requesting a new room to be created.
     * It should maybe be moved to another service.
     * @override
     */
    public newRoom(): void {
        this._webSocketService.send({}, 'create');
    }

    /**
     * This functions sends Join message for a given room id to a server.
     * @param id ID of a room user requests to join.
     * @override
     */
    public joinRoom(id: string): void {
        this._webSocketService.send({roomId: id}, 'join');
    }

    /**
     * This function sets WebSocketService's roomId.
     * @param id ID of a room user is currently in.
     */
    public setRoom(id: string): void {
        this._webSocketService.roomId = id;
    }

}
