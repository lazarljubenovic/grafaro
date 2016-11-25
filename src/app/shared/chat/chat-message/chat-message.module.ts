import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {ChatMessageComponent} from "./chat-message.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
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
export class ChatMessageModule{}
