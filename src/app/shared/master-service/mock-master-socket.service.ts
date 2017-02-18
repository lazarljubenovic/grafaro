import {Injectable} from '@angular/core';
import {MasterSocketInterface, MasterMessage} from './master-socket';

@Injectable()
export class MockMasterSocketService extends MasterSocketInterface {

    /**
     * Dummy master message to be next-ed on request.
     * @type {MasterMessage}
     * @private
     */
    private _dummyMasterMessage: MasterMessage = {
        isMaster: true,
    };

    /**
     * Simulate request by next-ing dummyMasterMessage.
     * @public
     */
    public requestMasterMessage(): void {
        console.log('request master');
        this.masterSocket$.next(this._dummyMasterMessage);
    }

    constructor() {
        super();
    }

}
