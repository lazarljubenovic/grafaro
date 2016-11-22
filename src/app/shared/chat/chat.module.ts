import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ChatComponent} from "./chat.component";
import {ChatMessageComponent} from "./chat-message/chat-message.component";
import {MarkdownService} from "../markdown.service";

@NgModule({
    imports: [
        CommonModule,
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
