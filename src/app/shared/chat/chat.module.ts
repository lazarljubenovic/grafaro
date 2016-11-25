import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ChatComponent} from "./chat.component";
import {ChatMessageComponent} from "./chat-message/chat-message.component";
import {FormsModule} from "@angular/forms";
import {ChatService} from "./chat.service";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    declarations: [
        ChatComponent,
        ChatMessageComponent,
    ],
    exports: [
        ChatComponent,
        ChatMessageComponent,
    ],
    providers: [
        ChatService,
    ],
})
export class ChatModule {
}
