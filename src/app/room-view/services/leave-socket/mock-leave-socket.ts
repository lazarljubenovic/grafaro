import {LeaveSocketInterface} from './leave-socket.base';
export class MockLeaveSocket extends LeaveSocketInterface {

    /**
     * Does nothing.
     * @public
     * @override
     */
    public leave(): void {
        // empty function
    }

    constructor() {
        super();
    }

}
