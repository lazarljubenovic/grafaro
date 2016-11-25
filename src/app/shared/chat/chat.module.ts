import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ChatComponent} from "./chat.component";
import {FormsModule} from "@angular/forms";
import {ChatService} from "./chat.service";
import {ChatMessageModule} from "./chat-message/chat-message.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ChatMessageModule,
    ],
    declarations: [
        ChatComponent,
    ],
    exports: [
        ChatComponent,
    ],
    providers: [
        ChatService,
    ],
})
export class ChatModule {
}
