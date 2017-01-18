import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';

@Injectable()
export class NotifyService {

    public stateChange$: ReplaySubject<any> = new ReplaySubject<any>();

    constructor() {
    }

}
