import {Component, OnInit} from '@angular/core';
import {Auth0Service} from './core/auth0.service';
import {WebSocketService} from './websocket.service';

@Component({
    selector: 'grf-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

    constructor(private webSocket: WebSocketService,
                private auth: Auth0Service) {
    }

    ngOnInit() {
        this.webSocket.connect('ws://localhost:4000');
    }

}
