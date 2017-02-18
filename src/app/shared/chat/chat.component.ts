import {
    Component,
    OnInit,
    ViewContainerRef,
    ViewChild,
    ComponentFactoryResolver,
    ComponentRef,
    ElementRef,
    ComponentFactory,
    OnDestroy
} from '@angular/core';
import {ChatMessageComponent} from './chat-message/chat-message.component';
import {Auth0Service} from '../../core/auth0.service';
import {Profile} from '../../login-page/user.service';
import {ChatMessageInfo} from './chat-message-info.interface';
import {ChatStorageService} from './services/chat-storage.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'grf-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {

    /**
     * Subscription for chat message stream.
     * @type {Subscription}
     * @private
     */
    private _chatMessageSubscription: Subscription;
    /**
     * User profile info.
     * @type {Profile}
     * @private
     */
    private _profile: Profile;
    /**
     * Reference on a single ChatMessageComponent.
     * @type {any}
     * @public
     */
    @ViewChild('messageOutlet', {read: ViewContainerRef})
    public messageOutlet: any;
    /**
     * ElementRef on an array of ChatMessageComponent.
     * @type {ElementRef}
     * @public
     */
    @ViewChild('messages')
    public messagesContainer: ElementRef;
    /**
     * ComponentFactory for ChatMessageComponent.
     * @type {ComponentFactory<ChatMessageComponent>}
     * @private
     */
    private _chatMessageFactory: ComponentFactory<ChatMessageComponent>;
    /**
     * Current typed message by user.
     * @type {string}
     * @public
     */
    public currentTypedMessage: string = '';
    /**
     * Last received message.
     * @type {ChatMessageInfo}
     * @private
     */
    private _lastChatMessageInfo: ChatMessageInfo;

    /**
     * Util function.
     */
    private scrollToBottom(): void {
        setTimeout(() => this.messagesContainer.nativeElement.scrollTop =
            this.messagesContainer.nativeElement.scrollHeight);
    }

    /**
     * Function to test if chat messages should be grouped together.
     * @param message
     * @returns {boolean}
     */
    private isContinuous(message: ChatMessageInfo): boolean {
        // If still nothing is set
        if (!this._lastChatMessageInfo) {
            return false;
        }
        if (message.senderName !== this._lastChatMessageInfo.senderName) {
            return false;
        }
        const maxDelayMilliseconds: number = 60000; // 1 minute
        const delay: number = (+new Date(message.timeStamp)) -
            (+new Date(this._lastChatMessageInfo.timeStamp));
        return delay <= maxDelayMilliseconds;
    }

    /**
     * Function for creating ChatMessageComponent.
     * @param chatMessageInfo Message data to be displayed.
     */
    private createChatMessage(chatMessageInfo: ChatMessageInfo): void {
        let cmp: ComponentRef<ChatMessageComponent> =
            this.messageOutlet.createComponent(this._chatMessageFactory);
        cmp.instance.info = chatMessageInfo;
        cmp.instance.isShort = this.isContinuous(chatMessageInfo);
        this._lastChatMessageInfo = chatMessageInfo;
        this.scrollToBottom();
    }

    /**
     * Test function for empty message string.
     * @returns {boolean}
     */
    private isEmptyMessage(): boolean {
        return this.currentTypedMessage.trim() === '';
    }

    /**
     * Util function.
     * @param event
     * @returns {boolean}
     */
    public onKeyDown(event: KeyboardEvent) {
        const key: string = event.key;
        if (key == 'Enter') {
            if (this.isEmptyMessage()) {
                setTimeout(() => this.currentTypedMessage = '');
            }
            return false;
        }
    }

    /**
     * Test if 'enter' was released.
     * Main message sending logic.
     * @param key
     * @returns {boolean}
     */
    public onKeyUp(key: string) {
        if (this.isEmptyMessage()) {
            return false;
        }
        if (key == 'Enter') {
            let chatMessage: ChatMessageInfo = {
                senderName: this._profile.displayName,
                timeStamp: new Date(),
                message: this.currentTypedMessage
            };
            this.sendMessage(chatMessage);
            this.createChatMessage(chatMessage);
            this.currentTypedMessage = '';
        }
    }

    /**
     * Send newly typed message.
     * @param message
     */
    public sendMessage(message: ChatMessageInfo): void {
        this._chatStorage.send(message);
    }

    /**
     * Chat component class for showing chat in the sidebar.
     * It creates chat messages as they come along using _cfr.
     * @param _chatStorage Mediator class for exposing producers.
     * @param _cfr ComponentFactoryResolver for ChatMessageComponent
     * @param _auth0 Auth0Service for user profile
     */
    constructor(private _chatStorage: ChatStorageService,
                private _cfr: ComponentFactoryResolver,
                private _auth0: Auth0Service) {
        this._auth0.user$.subscribe(user => {
            this._profile = user;
        });
    }

    /**
     * This function is used for subscription to incoming chat messages.
     */
    ngOnInit() {
        this._chatMessageFactory = this._cfr.resolveComponentFactory(ChatMessageComponent);
        this._chatMessageSubscription = this._chatStorage
            .chatMessages$.subscribe((message: ChatMessageInfo) => {
                this.createChatMessage(message);
            });
    }

    /**
     * This function is used for proper observables' management.
     */
    ngOnDestroy() {
        this._chatMessageSubscription.unsubscribe();
    }

}
