import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ChatComponent} from "./chat.component";
import {ChatMessageComponent} from "./chat-message/chat-message.component";
import {FormsModule} from "@angular/forms";

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
})
export class ChatModule {
}
