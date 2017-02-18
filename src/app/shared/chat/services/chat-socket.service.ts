import {Injectable} from '@angular/core';
import {WebSocketService} from '../../../websocket.service';
import {ChatMessageInfo} from '../../../../../server/interfaces';
import {ChatSocketInterface} from './chat-socket';


@Injectable()
export class ChatSocketService extends ChatSocketInterface {
    /**
     * Redefinition of send function which sends message to a socket.
     * @override
     * @param chatMessage
     */
    public send(chatMessage: ChatMessageInfo): void {
        this._webSocketService.send(chatMessage, 'chat');
    }

    /**
     * Full scale ChatSocket class for real communication with a server socket.
     * @param _webSocketService
     */
    constructor(private _webSocketService: WebSocketService) {
        super();
        this._webSocketService.subscribeTo('chat')
            .subscribe((message: ChatMessageInfo) => {
                this.chatSocket$.next(message);
            });
    }

}
