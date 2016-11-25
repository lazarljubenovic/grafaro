import {Injectable, Inject} from '@angular/core';
import {WebSocketService} from "../websocket.service";
import {ChatMessageInfo} from "./chat-message/chat-message.component";
import {Observable} from "rxjs";
import {Message} from "../../message";

@Injectable()
export class ChatService {
    private chatSubject: Observable<ChatMessageInfo>;

    constructor(@Inject(WebSocketService) private webSocketService: WebSocketService) {
    }

    public create(url: string): Observable<ChatMessageInfo>{
        this.chatSubject = this.webSocketService.create(url)
            .filter((msg: Message<ChatMessageInfo>) => msg.type == 'chat')
            .map((msg: Message<ChatMessageInfo>) => {
                return msg.payload;
            });

        return this.chatSubject;
    }

    public send(chatMessage: ChatMessageInfo): void {
        this.webSocketService.send(chatMessage, 'chat');
    }

}
