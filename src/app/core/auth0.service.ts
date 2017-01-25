import {Injectable, Inject} from '@angular/core';
import {tokenNotExpired} from 'angular2-jwt';
import {Router} from '@angular/router';
import * as auth0 from 'auth0-js';
import {UserService} from '../login-page/user.service';

export interface Profile {
    _id: string;
    displayName: string;
    socialId: string;
}

@Injectable()
export class Auth0Service {

    private userProfile: Profile;

    // Configure Auth0
    // todo type?
    auth0 = new (<any>auth0).WebAuth({
        domain: 'pritilender.eu.auth0.com',
        clientID: 'Vzzk8AXP4Ret2DaR0SATsiSa4yDHR5Zw',
        redirectUri: 'http://localhost:4200',
        responseType: 'token id_token',
        scope: 'profile'
    });

    constructor(@Inject(UserService) private userService: UserService,
                private router: Router) {
        this.handleAuthentication();
    }

    public handleAuthentication(): void {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                window.location.hash = '';
                this.setUser(authResult);
                this.router.navigate(['/']);
            } else if (authResult && authResult.error) {
                alert('Error: ' + authResult.error);
            }
        });
    }

    public socialLogin(connection: string): void {
        this.auth0.authorize({
            connection
        });
    }

    public isAuthenticated(): boolean {
        // Check whether the id_token is expired or not
        return tokenNotExpired();
    }

    public logout(): void {
        this.userProfile = null;
        localStorage.removeItem('socialId');
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        this.router.navigate(['/login']);
    }

    private setUser(authResult): void {
        const socialId: string = authResult.idTokenPayload.user_id;

        this.userService.getUserBySocialId(socialId)
            .subscribe(dbUser => {
                this.userProfile = dbUser;
            });

        localStorage.setItem('socialId', socialId);
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
    }
}
