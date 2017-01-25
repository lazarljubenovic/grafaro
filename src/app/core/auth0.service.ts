import {Injectable, Inject} from '@angular/core';
import {tokenNotExpired} from 'angular2-jwt';
import Auth0Lock from 'auth0-lock';
import {UserService} from '../login-page/user.service';

declare const Auth0;

export interface Profile {
    _id: string;
    displayName: string;
    socialId: string;
}

@Injectable()
export class Auth0Service {
    // private auth0 = new Auth0({
    //     domain: 'pritilender.eu.auth0.com',
    //     clientID: 'Vzzk8AXP4Ret2DaR0SATsiSa4yDHR5Zw',
    //     callbackURL: 'http://localhost:4200',
    //     responseType: 'token'
    // });
    //
    private lock = new Auth0Lock(
        'Vzzk8AXP4Ret2DaR0SATsiSa4yDHR5Zw',
        'pritilender.eu.auth0.com',
        {});

    private userProfile: Profile;

    constructor(@Inject(UserService) private userService: UserService) {
        this.userProfile = JSON.parse(localStorage.getItem('profile'));

        this.lock.on(`authenticated`, (authResult) => {
            localStorage.setItem('id_token', authResult.idToken);

            (<any>this.lock).getUserInfo(authResult.accessToken, (error, profile) => {
                if (error) {
                    console.log(error);
                    return;
                }

                const socialId: string = profile['user_id'];
                this.userService.getUserBySocialId(socialId)
                    .subscribe(profile => {
                        console.log('Profile from DB', profile);
                        this.userProfile = profile;
                        localStorage.setItem('profile', JSON.stringify(profile));
                    });
            });
        });
    }

    public authenticated() {
        // Check if there's an unexpired JWT
        // This searches for an item in localStorage with key == 'id_token'
        return tokenNotExpired();
    }

    public logout() {
        // Remove token from localStorage
        console.log(localStorage.getItem('id_token'));
        console.log('Logout');
        localStorage.removeItem('id_token');
        localStorage.removeItem('profile');
        console.log(localStorage.getItem('id_token'));
    }

    // public socialLogin(connection: string) {
    //     this.auth0.login({
    //         connection
    //     }, (err) => {
    //         if (err) {
    //             console.log('Woops', err);
    //         }
    //     });
    // }
}
