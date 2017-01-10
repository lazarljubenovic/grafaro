import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'grf-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

    public facebookLogin() {
        // TODO
        console.log('TODO: Login with Facebook');
    }

    public twitterLogin() {
        // TODO
        console.log('TODO: Login with Twitter');
    }

    public googleLogin() {
        // TODO
        console.log('TODO: Login with Facebook');
    }

    constructor() {
    }

    ngOnInit() {
    }

}
