import {Injectable} from '@angular/core';
import {WebSocketService} from '../../websocket.service';
import {Observable} from 'rxjs';

export interface ChatMessageInfo {
    timeStamp: Date;
    senderName: string;
    message: string;
}

@Injectable()
export class ChatService {
    public chatSocket$: Observable<ChatMessageInfo>;

    constructor(private _webSocketService: WebSocketService) {
        this.chatSocket$ = this._webSocketService.subscribeTo('chat');
    }

    public send(chatMessage: ChatMessageInfo): void {
        this._webSocketService.send(chatMessage, 'chat');
    }

}
