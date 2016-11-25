import {Component, OnInit} from "@angular/core";
import {ChatMessageInfo} from "./chat-message/chat-message.component";
import {ChatService} from "./chat.service";
import {Observable} from "rxjs";

@Component({
    selector: 'grf-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

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

    public chatMessages: Observable<any>;

    public currentTypedMessage: string;

    public onKeyUp(key: string) {
        if (key == 'Enter') {
            let chatMessage: ChatMessageInfo;

            chatMessage.senderHandle = 'lazar';
            chatMessage.senderHash = '34536545432545432';
            chatMessage.senderName = 'Lazar Ljubenović';
            chatMessage.timeStamp = new Date();

            this.sendMessage(chatMessage);

            this.currentTypedMessage = '';
        }
    }

    public sendMessage(message: ChatMessageInfo): void {
        this.chatService.send(message);
    }

    constructor(private chatService: ChatService) {
        this.chatMessages = this.chatService.create("ws://localhost:4000");
        this.chatMessages.subscribe(msg => {
            this.dummyMessages.push(msg);
        });
        this.chatService.send({
            message: "init",
            senderHandle: "lazar",
            senderHash: "231230213412412",
            senderName: "Lazar Ljubenovic",
            timeStamp: new Date()
        });
    }

    ngOnInit() {
    }

}
