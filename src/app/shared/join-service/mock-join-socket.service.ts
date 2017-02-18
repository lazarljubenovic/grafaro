import {Injectable} from '@angular/core';
import {JoinSocketInterface} from './join-socket';
import {JoinMessageInfo} from './join-socket.service';

/**
 * Mock class for imitating web server.
 */
@Injectable()
export class MockJoinSocketService extends JoinSocketInterface {
    /**
     * Dummy join message to be send on newRoom() call.
     * @type {JoinmessageInfo}
     * @private
     */
    private _dummyJoinMessage: JoinMessageInfo = {
        roomId: '123456',
        error: '',
    };

    /**
     * Function that simulates new room creation.
     * @override
     */
    public newRoom(): void {
        // sends join and then a master message
        this.joinSocket$.next(this._dummyJoinMessage);
    }

    /**
     * Function that simulates room join by next-ing _dummyJoinMessage.
     * @param id ID of a room to join
     */
    public joinRoom(id: string): void {
        this._dummyJoinMessage.roomId = id;
        this.joinSocket$.next(this._dummyJoinMessage);
    }

    /**
     * Empty function because this is not needed in mock situation.
     * @param id
     */
    public setRoom(id: string): void {
        // do nothing
    }

    constructor() {
        super();
    }

}
