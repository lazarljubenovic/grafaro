import {Subject} from 'rxjs';
import {ChatMessageInfo} from '../chat-message-info.interface';

export abstract class ChatSocketInterface {
    /**
     * Stream of messages coming from the socket.
     * @type {Subject<ChatMessageInfo>}
     * @public
     */
    public chatSocket$: Subject<ChatMessageInfo>;

    /**
     * Abstract function for sending messages to server.
     * @param chatMessage
     */
    public abstract send(chatMessage: ChatMessageInfo): void;

    /**
     * Base abstract class for ChatSocket producers.
     */
    public constructor() {
        this.chatSocket$ = new Subject();
    }
}
