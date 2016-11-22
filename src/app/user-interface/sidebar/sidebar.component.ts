import {Component, OnInit, OnDestroy} from "@angular/core";
import {ChatMessageInfo} from "../../shared/chat/chat-message/chat-message.component";
import {Observable, Subject} from "rxjs";
import {WebSocketService} from "../../shared/websocket.service";

@Component({
    selector: 'grf-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

    public dummyMessages: ChatMessageInfo[] = [
        {
            timeStamp: new Date(),
            senderHandle: `lazarljubenovic`,
            senderName: `Lazar Ljubenović`,
            senderHash: `ff8adece0631821959f443c9d956fc39`,
            message: `Hello World!`,
        },
        {
            timeStamp: new Date(),
            senderHandle: `pritilender`,
            senderName: `Mihajlo Ilijić`,
            senderHash: `ff8adece0631821959f443c9d956fc39`,
            message: `Hello World! **bold** _italic_ ~~strike~~`,
        },
        {
            timeStamp: new Date(),
            senderHandle: `lazarljubenovic`,
            senderName: `Lazar Ljubenović`,
            senderHash: `ff8adece0631821959f443c9d956fc39`,
            message: `Hello World! [link](www.google.com)`,
        },
        {
            timeStamp: new Date(),
            senderHandle: `pritilender`,
            senderName: `Mihajlo Ilijić`,
            senderHash: `ff8adece0631821959f443c9d956fc39`,
            message: `Hello World! :) :* ;) :(`,
        },
        {
            timeStamp: new Date(),
            senderHandle: `lazarljubenovic`,
            senderName: `Lazar Ljubenović`,
            senderHash: `ff8adece0631821959f443c9d956fc39`,
            message: `Hello World! :joy: :heart: :sob: :+1:`,
        },
    ];

    private chatWebSocket: Observable<any>;

    constructor(private webSocketService: WebSocketService) {
        this.chatWebSocket = this.webSocketService.create("ws://localhost:4000");
        this.chatWebSocket.subscribe(msg => {
            this.dummyMessages.push(msg);
        });
        this.webSocketService.send("Helou");
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

}
