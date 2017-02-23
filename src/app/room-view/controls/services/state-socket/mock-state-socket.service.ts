import {Injectable} from '@angular/core';
import {StateSocketInterface} from './state-socket';

@Injectable()
export class MockStateSocketService extends StateSocketInterface {
    public send(stateIndex: number): void {
        // do nothing
    }

    public requestStateMessage(): void {
        this.stateSocket$.next({stateIndex: 0});
    }

    constructor() {
        super();
    }

}
