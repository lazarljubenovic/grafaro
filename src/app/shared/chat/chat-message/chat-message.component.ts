import {Component, OnInit, Input} from "@angular/core";

export interface ChatMessageInfo {
    timeStamp: Date;
    senderName: string;
    senderHandle: string;
    senderHash: string;
    message: string;
}

@Component({
    selector: 'grf-chat-message',
    templateUrl: './chat-message.component.html',
    styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit {

    @Input()
    public info: ChatMessageInfo;

    constructor() {
    }

    ngOnInit() {
    }

}
