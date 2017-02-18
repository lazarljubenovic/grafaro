import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChatComponent} from './chat.component';
import {FormsModule} from '@angular/forms';
import {ChatSocketService} from './services/chat-socket.service';
import {ChatMessageModule} from './chat-message/chat-message.module';
import {CoreModule} from '../../core/core.module';
import {MockChatSocketService} from './services/mock-chat-socket.service';
import {ChatStorageService} from './services/chat-storage.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CoreModule,
        ChatMessageModule,
    ],
    declarations: [
        ChatComponent,
    ],
    exports: [
        ChatComponent,
    ],
    providers: [
        ChatSocketService,
        MockChatSocketService,
        ChatStorageService,
    ],
})
export class ChatModule {
}
