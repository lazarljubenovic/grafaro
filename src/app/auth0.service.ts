import {Injectable} from '@angular/core';
import {tokenNotExpired} from 'angular2-jwt';
import Auth0Lock from 'auth0-lock';

@Injectable()
export class Auth0Service {
    // Configure Auth0
    lock = new Auth0Lock('Vzzk8AXP4Ret2DaR0SATsiSa4yDHR5Zw', 'pritilender.eu.auth0.com', {});
    userProfile: Object;

    constructor() {
        this.userProfile = JSON.parse(localStorage.getItem('profile'));
        // Add callback for lock `authenticated` event
        this.lock.on(`authenticated`, (authResult) => {
            localStorage.setItem('id_token', authResult.idToken);

            this.lock.getProfile(authResult.idToken, (error, profile) => {
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

    public login() {
        // Call the show method to display the widget.
        this.lock.show();
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
}
