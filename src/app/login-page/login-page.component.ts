import {Component, OnInit} from '@angular/core';
import {Auth0Service} from '../core/auth0.service';

@Component({
    selector: 'grf-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

    public facebookLogin() {
        // this.auth0.socialLogin('facebook');
    }

    public twitterLogin() {
        // this.auth0.socialLogin('twitter');
    }

    public googleLogin() {
        // this.auth0.socialLogin('google-oauth2');
    }

    constructor(private auth0: Auth0Service) {
    }

    ngOnInit() {
    }

}
