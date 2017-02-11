import {Component, OnInit} from '@angular/core';
import {Auth0Service} from './core/auth0.service';

@Component({
    selector: 'grf-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

    constructor(private auth: Auth0Service) {
    }

    ngOnInit() {

    }

}
