import {Injectable} from '@angular/core';
import {ChatSocketInterface} from './chat-socket';
import {ChatMessageInfo} from '../../../../../server/interfaces';

@Injectable()
export class MockChatSocketService extends ChatSocketInterface {
    /**
     * Just a bunch of dummy messages to be sent when user enters the room.
     * @type {ChatMessageInfo[]}
     * @private
     */
    private _dummyMessages: ChatMessageInfo[] = [
        {
            timeStamp: new Date(),
            senderName: `Lazar Ljubenović`,
            message: `Hello World!`,
        },
        {
            timeStamp: new Date(),
            senderName: `Mihajlo Ilijić`,
            message: `Hello World! **bold** _italic_ ~~strike~~`,
        },
        {
            timeStamp: new Date(),
            senderName: `Lazar Ljubenović`,
            message: `Hello World! [link](www.google.com)`,
        },
        {
            timeStamp: new Date(),
            senderName: `Mihajlo Ilijić`,
            message: `Hello World! :) :* ;) :(`,
        },
        {
            timeStamp: new Date(),
            senderName: `Lazar Ljubenović`,
            message: `Hello World! :joy: :heart: :sob: :+1:`,
        },
    ];

    /**
     * Empty redefinition of send function.
     * Mock service doesn't need to send messages anywhere.
     * @override
     * @param chatMessage
     */
    public send(chatMessage: ChatMessageInfo): void {
        // do nothing
    }

    /**
     * Mock ChatSocket class with dummy messages and empty send method.
     * @param wasOpen
     */
    constructor(wasOpen: boolean) {
        super();

        // send messages only if it wasn't connected to server
        if (!wasOpen) {
            setTimeout(() =>
                    this._dummyMessages.forEach(message => this.chatSocket$.next(message)),
                2000);
        }
    }

}
