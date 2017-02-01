import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs';

@Injectable()
export class GrafaroHttpService {
    protected url: string = 'http://localhost:4000';

    constructor(protected http: Http) {
    }

    protected responseToObject(response: Response): any {
        let jsonResponse = response.json();
        let data: any;

        if (jsonResponse['error']) {
            this.handleError(jsonResponse['error']);
        } else if (jsonResponse['status']) {
            data = jsonResponse.status;
        } else {
            data = jsonResponse.data;
        }
        return data || {};
    }

    protected handleError(error: string): Observable<any> {
        console.error(error); // log to console instead
        return Observable.throw(error);
    }

}
