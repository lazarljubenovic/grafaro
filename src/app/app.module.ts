import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {StepperModule} from "./shared/stepper/stepper.module";
import {BreadthFirstSearchService} from "./breadth-first-search/breadth-first-search.service";
import {UserInterfaceModule} from "./user-interface/user-interface.module";
import {MarkdownService} from "./shared/markdown.service";
import {EmojiService} from "./shared/emoji.service";
import {GraphOptionsService} from "./graph-options.service";

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        StepperModule,
        UserInterfaceModule,
        //StoreModule.provideStore(reducer),
    ],
    providers: [
        BreadthFirstSearchService,
        MarkdownService,
        EmojiService,
        GraphOptionsService,
    ],
    bootstrap: [
        AppComponent,
    ],
})
export class AppModule {
}
