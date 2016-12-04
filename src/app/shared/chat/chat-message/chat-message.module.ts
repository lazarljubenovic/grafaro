import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {ChatMessageComponent} from './chat-message.component';
import {JdenticonModule} from '../../../jdenticon/jdenticon.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        JdenticonModule,
    ],
    declarations: [
        ChatMessageComponent,
    ],
    exports: [
        ChatMessageComponent,
    ],
    entryComponents: [
        ChatMessageComponent,
    ],
})
export class ChatMessageModule {
}
