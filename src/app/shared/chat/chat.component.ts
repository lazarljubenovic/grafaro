import {Component, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver, ComponentRef} from "@angular/core";
import {ChatMessageInfo, ChatMessageComponent} from "./chat-message/chat-message.component";
import {ChatService} from "./chat.service";
import {Observable} from "rxjs";

@Component({
    selector: 'grf-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

    @ViewChild('message', {read: ViewContainerRef})
    private viewContainerRef: any;

    private messageFactory;

    public chatMessages$: Observable<any>;

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

    constructor(private chatService: ChatService,
                private componentFactoryResolver: ComponentFactoryResolver) {
    }

    ngOnInit() {
        this.messageFactory =  this.componentFactoryResolver.resolveComponentFactory(ChatMessageComponent);
        this.chatMessages$ = this.chatService.create("ws://localhost:4000");

        this.chatService.send({
            message: "init",
            senderHandle: "lazar",
            senderHash: "231230213412412",
            senderName: "Lazar Ljubenovic",
            timeStamp: new Date()
        });

        this.chatMessages$.subscribe(msg => {
            //this.dummyMessages.push(msg);
            if (msg) {
                console.log(msg);
                let cmp: ComponentRef<ChatMessageComponent> = this.viewContainerRef.createComponent(this.messageFactory);
                cmp.instance.info = msg;
                console.log("blacmpins", cmp.instance);
            }
        });
    }

}
