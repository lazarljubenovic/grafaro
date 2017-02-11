import {Injectable, Inject} from '@angular/core';
import {WebSocketService} from '../../websocket.service';
import {Observable} from 'rxjs';

export interface ChatMessageInfo {
    timeStamp: Date;
    senderName: string;
    senderHandle: string;
    senderHash: string;
    message: string;
}

@Injectable()
export class ChatService {
    public chatSocket$: Observable<ChatMessageInfo>;

    constructor(@Inject(WebSocketService) private webSocketService: WebSocketService) {
        this.chatSocket$ = this.webSocketService.subscribeTo('chat');
    }

    public send(chatMessage: ChatMessageInfo): void {
        this.webSocketService.send(chatMessage, 'chat');
    }

}
