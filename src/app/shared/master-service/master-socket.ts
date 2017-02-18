import {Subject} from 'rxjs';

export interface MasterMessage {
    isMaster: boolean;
}

export abstract class MasterSocketInterface {
    /**
     * Stream of Master messages.
     * @type {Subject<MasterMessage>}
     * @public
     */
    public masterSocket$: Subject<MasterMessage>;

    constructor() {
        this.masterSocket$ = new Subject();
    }

    /**
     * Request master message from server.
     * @abstract
     * @public
     */
    public abstract requestMasterMessage(): void;
}
