import {Injectable} from '@angular/core';
import {GrafaroHttpService} from '../shared/grafaro-http.service';
import {Http} from '@angular/http';
import {Observable} from 'rxjs';
import {Profile} from '../core/auth0.service';

@Injectable()
export class UserService extends GrafaroHttpService {

    constructor(http: Http) {
        super(http);
        this.url += '/user';
    }

    public getUserBySocialId(socialId: string): Observable<Profile> {
        return this.http.get(`${this.url}/social/${socialId}`)
            .map(x => this.responseToObject(x))
            .catch(err => this.handleError(err));
    }

    public changeDisplayName(id: string, user: Profile): Observable<string> {
        return this.http.post(`${this.url}/${id}`, {data: user})
            .map(x => this.responseToObject(x))
            .catch(err => this.handleError(err));
    }

}
