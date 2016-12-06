import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class TabsService {

    public tabChange: Subject<number> = new Subject<number>();

    constructor() {
    }

}
