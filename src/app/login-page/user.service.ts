import {Injectable} from '@angular/core';
import {GrafaroHttpService} from '../shared/grafaro-http.service';
import {Http} from '@angular/http';
import {Observable, BehaviorSubject} from 'rxjs';

export interface Profile {
    _id: string;
    displayName: string;
    socialId: string;
}

@Injectable()
export class UserService extends GrafaroHttpService {
    private _user: Profile = {
        _id: '',
        displayName: '',
        socialId: '',
    };
    private _mockUserStream: BehaviorSubject<Profile> = new BehaviorSubject({
        _id: '1234',
        displayName: 'Test user',
        socialId: '12345',
    });

    constructor(http: Http) {
        super(http);
        this.url += '/user';
    }

    public getUserBySocialId(socialId: string): Observable<Profile> {
        return this.http.get(`${this.url}/social/${socialId}`)
            .map(x => {
                const profile = this.responseToObject(x);
                this._user = profile;
                return profile;
            })
            .catch(err => {
                this.handleError(err);
                return this._mockUserStream;
            });
    }

    public changeDisplayName(newName: string): Observable<Profile> {
        const user: Profile = {
            _id: this._user._id,
            displayName: newName,
            socialId: this._user.socialId
        };

        return this.http.post(`${this.url}/${user._id}`, {data: user})
            .map(x => {
                const response = this.responseToObject(x);
                if (response == 'success') {
                    this._user = user;
                    return this._user;
                } else {
                    throw 'TODO';
                }
            })
            .catch(err => {
                this.handleError(err);
                this._mockUserStream.next(user);
                return this._mockUserStream;
            });
    }

}
