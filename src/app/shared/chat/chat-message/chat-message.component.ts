import {Component, OnInit, Input} from "@angular/core";
import {MarkdownService} from "../../markdown.service";
import {EmojiService} from "../../emoji.service";

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

    private _info: ChatMessageInfo;

    @Input()
    public set info(info: ChatMessageInfo) {
        this._info = info;
        this.updateParsed();
    }

    public get info() {
        return this._info;
    }

    public parsedMessageHtml: string;

    private updateParsed() {

        this.parsedMessageHtml = this.emojiService.transformUtf8(
            this.emojiService.transformTextLike(
                this.markdownService.transform(this.info.message)
            )
        );
    }

    constructor(private markdownService: MarkdownService,
                private emojiService: EmojiService) {
    }

    ngOnInit() {
    }

}
