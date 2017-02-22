import {Injectable} from '@angular/core';
import {AlgorithmSocketInterface} from './algorithm-socket';
import {FormOptions} from '../../algorithm-picker/algorithm-picker.component';

@Injectable()
export class MockAlgorithmSocketService extends AlgorithmSocketInterface {

    /**
     * Mock algorithm and options to be next-ed on request.
     * @type {FormOptions}
     * @private
     */
    private _dummyAlgorithm: FormOptions = {
        algorithm: 'bfs',
        options: {
            root: 'A',
        },
    };

    /**
     * Mock service just next-s _dummyAlgorithm on request
     * @override
     * @public
     */
    public requestAlgorithmWithOptions() {
        this.algorithmSocket$.next({info: this._dummyAlgorithm});
    }

    /**
     * Empty override. It doesn't need to send algorithm to anyone.
     * @override
     * @public
     * @param info
     */
    public send(info: FormOptions): void {
        // do nothing
    }

    constructor() {
        super();
    }

}
