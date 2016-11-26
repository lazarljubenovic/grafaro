import {
	Component,
	OnInit,
	ViewContainerRef,
	ViewChild,
	ComponentFactoryResolver,
	ComponentRef
} from "@angular/core";
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
	private chatMessageRef: any;

	private chatMessageFactory;

	public chatMessages$: Observable<any>;

	public currentTypedMessage: string;

	private createChatMessage(content: ChatMessageInfo): void {
		let cmp: ComponentRef<ChatMessageComponent> =
			this.chatMessageRef.createComponent(this.chatMessageFactory);
		cmp.instance.info = content;
	}

	public onKeyUp(key: string) {
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
		this.chatMessages$ = this.chatService.create("ws://localhost:4000");

		this.chatService.send({
			message: "init",
			senderHandle: "lazar",
			senderHash: "231230213412",
			senderName: "Lazar Ljubenovic",
			timeStamp: new Date(),
		});

		this.chatMessages$.subscribe((message: ChatMessageInfo) => {
			this.createChatMessage(message);
		});
	}

}
