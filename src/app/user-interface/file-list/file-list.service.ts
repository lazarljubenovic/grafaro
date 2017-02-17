import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

export interface GraphPath {
    folder: string;
    filename: string;
}

@Injectable()
export class FileListService {

    public fileSelect$ = new Subject<GraphPath>();

    constructor() {
    }

}
