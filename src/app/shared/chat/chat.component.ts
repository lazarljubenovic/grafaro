import {Component, OnInit} from "@angular/core";
import {WebSocketService} from "../websocket.service";
import {ChatMessageInfo} from "./chat-message/chat-message.component";

@Component({
    selector: 'grf-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

    public currentTypedMessage: string;

    public onKeyUp(key: string) {
        if (key == 'Enter') {
            this.sendMessage({
                message: this.currentTypedMessage,
                senderHandle: 'lazar',
                senderHash: '34536545432545432',
                senderName: 'Lazar Ljubenović',
                timeStamp: new Date(),
            });
            this.currentTypedMessage = '';
        }
    }

    public sendMessage(message: ChatMessageInfo): void {
        this.websocketService.send(message);
    }

    constructor(private websocketService: WebSocketService) {
    }

    ngOnInit() {
    }

}
