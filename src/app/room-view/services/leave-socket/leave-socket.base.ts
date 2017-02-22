import {Subject} from 'rxjs';
export interface LeaveSocketMessage {
    roomId: string;
}

export abstract class LeaveSocketInterface {
    /**
     * Stream of Leave messages coming from server.
     * Probably won't be used.
     * @public
     * @type {Subject<LeaveSocketMessage>}
     */
    public leaveSocket$: Subject<LeaveSocketMessage>;

    constructor() {
        this.leaveSocket$ = new Subject();
    }

    /**
     * Abstract function for sending leave request to a server.
     * @public
     * @abstract
     */
    public abstract leave(): void;
}
