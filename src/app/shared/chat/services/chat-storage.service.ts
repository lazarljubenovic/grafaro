import {Injectable} from '@angular/core';
import {ChatSocketInterface} from './chat-socket';
import {WebSocketService} from '../../../websocket.service';
import {ChatMessageInfo} from '../chat-message-info.interface';
import {Subject, Subscription} from 'rxjs';
import {ChatSocketService} from './chat-socket.service';
import {MockChatSocketService} from './mock-chat-socket.service';

@Injectable()
export class ChatStorageService {
    /**
     * Producer instance.
     * @type {ChatSocketInterface}
     * @private
     */
    private _chatSource: ChatSocketInterface;
    /**
     * Subscription for incoming messages.
     * @type {Subscription}
     * @private
     */
    private _messageSubscription: Subscription;
    /**
     * Status of socket. If it was open, then mock won't send dummy messages.
     * @type {boolean}
     * @private
     */
    private _wasOpen: boolean = false;
    /**
     * Stream of chat messages coming from producers.
     * @type {Subject<ChatMessageInfo>}
     * @public
     */
    public chatMessages$: Subject<ChatMessageInfo>;

    /**
     * This class is a sort of a mediator between consumers and producers.
     * Depending on WebSocket status, we know should a mock data be provided or the real one.
     * @param _webSocketService
     */
    constructor(private _webSocketService: WebSocketService) {
        this.chatMessages$ = new Subject();

        this._webSocketService.socketStatus.subscribe(status => {
            if (status) {
                this._chatSource = new ChatSocketService(this._webSocketService);
                this._wasOpen = true;
            } else {
                this._chatSource = new MockChatSocketService(this._wasOpen);
            }

            // unsubscribe before new subscription
            if (this._messageSubscription) {
                this._messageSubscription.unsubscribe();
            }
            this._messageSubscription = this._chatSource.chatSocket$.subscribe(message => {
                this.chatMessages$.next(message);
            });
        });
    }

    /**
     * This function delegates message sending to producers.
     * They know what they should do with it.
     * @param chatMessage
     */
    public send(chatMessage: ChatMessageInfo): void {
        this._chatSource.send(chatMessage);
    }

}
