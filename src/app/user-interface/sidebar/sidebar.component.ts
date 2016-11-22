import {Component, OnInit} from "@angular/core";
import {ChatMessageInfo} from "../../shared/chat/chat-message/chat-message.component";

@Component({
    selector: 'grf-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

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

    constructor() {
    }

    ngOnInit() {
    }

}
