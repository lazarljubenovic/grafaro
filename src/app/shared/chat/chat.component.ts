import {
    Component,
    OnInit,
    ViewContainerRef,
    ViewChild,
    ComponentFactoryResolver,
    ComponentRef,
    ElementRef,
    ComponentFactory
} from '@angular/core';
import {ChatMessageInfo, ChatMessageComponent} from './chat-message/chat-message.component';
import {ChatService} from './chat.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'grf-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

    @ViewChild('messageOutlet', {read: ViewContainerRef})
    public messageOutlet: any;

    @ViewChild('messages')
    public messagesContainer: ElementRef;

    private chatMessageFactory: ComponentFactory<ChatMessageComponent>;

    public chatMessages$: Observable<any>;

    public currentTypedMessage: string = '';

    private lastChatMessageInfo: ChatMessageInfo;

    private scrollToBottom(): void {
        setTimeout(() => this.messagesContainer.nativeElement.scrollTop =
            this.messagesContainer.nativeElement.scrollHeight);
    }

    private isContinuous(message: ChatMessageInfo): boolean {
        // If still nothing is set
        if (!this.lastChatMessageInfo) {
            return false;
        }
        if (message.senderName !== this.lastChatMessageInfo.senderName) {
            return false;
        }
        const maxDelayMiliseonds: number = 60000; // 1 minute
        const delay: number = (+new Date(message.timeStamp)) -
            (+new Date(this.lastChatMessageInfo.timeStamp));
        return delay <= maxDelayMiliseonds;
    }

    private createChatMessage(chatMessageInfo: ChatMessageInfo): void {
        let cmp: ComponentRef<ChatMessageComponent> =
            this.messageOutlet.createComponent(this.chatMessageFactory);
        cmp.instance.info = chatMessageInfo;
        cmp.instance.isShort = this.isContinuous(chatMessageInfo);
        this.lastChatMessageInfo = chatMessageInfo;
        this.scrollToBottom();
    }

    private isEmptyMessage(): boolean {
        return this.currentTypedMessage.trim() === '';
    }

    public onKeyDown(event: KeyboardEvent) {
        const key: string = event.key;
        if (key == 'Enter') {
            if (this.isEmptyMessage()) {
                setTimeout(() => this.currentTypedMessage = '');
            }
            return false;
        }
    }

    public onKeyUp(key: string) {
        if (this.isEmptyMessage()) {
            return false;
        }
        if (key == 'Enter') {
            let chatMessage: ChatMessageInfo = {
                senderHandle: 'lazar',
                senderHash: '231230213412',
                senderName: 'Lazar Ljubenović',
                timeStamp: new Date(),
                message: this.currentTypedMessage
            };
            this.sendMessage(chatMessage);
            this.createChatMessage(chatMessage);
            this.currentTypedMessage = '';
        }
    }

    public sendMessage(message: ChatMessageInfo): void {
        this.chatService.send(message);
    }

    constructor(private chatService: ChatService,
                private cfr: ComponentFactoryResolver) {
    }

    ngOnInit() {
        this.chatMessageFactory = this.cfr.resolveComponentFactory(ChatMessageComponent);
        this.chatMessages$ = this.chatService.create();
        this.chatMessages$.subscribe((message: ChatMessageInfo) => {
            this.createChatMessage(message);
        });
    }

}
