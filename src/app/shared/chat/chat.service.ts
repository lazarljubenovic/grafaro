import {Injectable, Inject} from '@angular/core';
import {WebSocketService} from '../../websocket.service';
import {ChatMessageInfo} from './chat-message/chat-message.component';
import {Observable} from 'rxjs';

@Injectable()
export class ChatService {
    // private chatSubject: Observable<ChatMessageInfo>;
    constructor(@Inject(WebSocketService) private webSocketService: WebSocketService) {
    }

    public create(): Observable<ChatMessageInfo> {
        console.log('Chat Ovde?');
        return this.webSocketService.subscribeTo('chat');
    }

    public send(chatMessage: ChatMessageInfo): void {
        this.webSocketService.send(chatMessage, 'chat');
    }

}
