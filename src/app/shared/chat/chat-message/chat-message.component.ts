import {Component, OnInit, Input, ViewEncapsulation, ViewChild, HostBinding} from '@angular/core';
import {MarkdownService} from '../../markdown.service';
import {EmojiService} from '../../emoji.service';
import {TabsService} from '../../tabs/tabs.service';
import {JdenticonComponent} from '../../../jdenticon/jdenticon.component';


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
    styleUrls: ['./chat-message.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ChatMessageComponent implements OnInit {

    @HostBinding('class.short')
    public isShort: boolean = false;

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

    @ViewChild(JdenticonComponent)
    public jdenticonComponentRef: JdenticonComponent;

    private updateParsed() {
        const message: string = this.info.message;
        const markdown: string = this.markdownService.transform(message);
        this.parsedMessageHtml = this.emojiService.transform(markdown);
    }

    constructor(private markdownService: MarkdownService,
                private emojiService: EmojiService,
                private tabsService: TabsService) {
    }

    ngOnInit() {
        this.tabsService.tabChange.subscribe(tabIndex => {
            setTimeout(() => this.jdenticonComponentRef.update());
        });
    }

}
