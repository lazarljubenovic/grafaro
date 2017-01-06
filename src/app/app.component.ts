import {Component, OnInit} from '@angular/core';
import {WebSocketService} from './core/websocket.service';
import {Auth0Service} from './auth0.service';

@Component({
    selector: 'grf-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

    constructor(private webSocket: WebSocketService,
                private auth: Auth0Service
    ) {
    }

    ngOnInit() {
        this.webSocket.create('ws://localhost:4000');
    }

}
