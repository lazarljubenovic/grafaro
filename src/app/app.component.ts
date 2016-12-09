import {Component, OnInit} from '@angular/core';
import {WebSocketService} from "./core/websocket.service";

@Component({
    selector: 'grf-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

    constructor(private webSocket: WebSocketService) {
    }

    ngOnInit() {
        this.webSocket.create('ws://localhost:4000/1213');
    }

}
