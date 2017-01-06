import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class FileListService {

    public fileSelect$ = new Subject<{id: string, filename: string}>();

    constructor() {
    }

}
