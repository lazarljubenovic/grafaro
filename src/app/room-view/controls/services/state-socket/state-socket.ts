import {Subject} from 'rxjs';

export interface StateMessage {
    stateIndex: number;
}

export abstract class StateSocketInterface {
    /**
     * Stream of state messages.
     * @type {Subject<StateMessage>}
     * @public
     */
    public stateSocket$: Subject<StateMessage>;

    /**
     * Abstract function which implements state sending to server.
     * @abstract
     * @param stateIndex
     * @public
     */
    public abstract send(stateIndex: number): void;

    /**
     * Abstract function for requesting state from server.
     */
    public abstract requestStateMessage(): void;

    constructor() {
        this.stateSocket$ = new Subject();
    }
}
