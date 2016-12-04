import {Injectable} from '@angular/core';
import * as sha1 from 'sha1';

@Injectable()
export class Sha1Service {

    private algorithm = sha1;

    public convert(plaintext: string): string {
        return this.algorithm(plaintext);
    }

    constructor() {
    }

}
