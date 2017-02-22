import {Subject} from 'rxjs';
import {FormOptions} from '../../algorithm-picker/algorithm-picker.component';

export interface AlgorithmMessage {
    info: FormOptions;
}

export abstract class AlgorithmSocketInterface {
    /**
     * Stream of algorithm messages.
     * @type {Subject<AlgorithmMessage>}
     * @public
     */
    public algorithmSocket$: Subject<AlgorithmMessage>;

    /**
     * Abstract function which implements algorithm and options sending to server.
     * @abstract
     * @public
     * @param info
     */
    public abstract send(info: FormOptions): void;

    /**
     * Abstract function for requesting algorithm and options from server.
     */
    public abstract requestAlgorithmWithOptions(): void;

    constructor() {
        this.algorithmSocket$ = new Subject();
    }
}
