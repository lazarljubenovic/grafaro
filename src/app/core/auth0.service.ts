import {Injectable} from '@angular/core';
import {tokenNotExpired} from 'angular2-jwt';
import Auth0Lock from 'auth0-lock';

declare const Auth0;

@Injectable()
export class Auth0Service {
    private auth0 = new Auth0({
        domain: 'pritilender.eu.auth0.com',
        clientID: 'Vzzk8AXP4Ret2DaR0SATsiSa4yDHR5Zw',
        callbackURL: 'http://localhost:4200',
        responseType: 'token'
    });
    private lock = new Auth0Lock(
        'Vzzk8AXP4Ret2DaR0SATsiSa4yDHR5Zw',
        'pritilender.eu.auth0.com',
        {});
    private userProfile: Object;

    constructor() {
        this.userProfile = JSON.parse(localStorage.getItem('profile'));

        this.lock.on(`authenticated`, (authResult) => {
            localStorage.setItem('id_token', authResult.idToken);

            this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
                if (error) {
                    console.log(error);
                    return;
                }

                localStorage.setItem('profile', JSON.stringify(profile));
                this.userProfile = profile;
                console.log(this.userProfile['user_id']);
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
        localStorage.removeItem('id_token');
    }

    public socialLogin(connection: string) {
        this.auth0.login({
            connection
        }, (err) => {
            if (err) {
                console.log('Woops', err);
            }
        });
    }
}
