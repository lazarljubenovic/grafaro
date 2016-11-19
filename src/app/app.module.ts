import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {StepperModule} from "./shared/stepper/stepper.module";
import {BreadthFirstSearchComponent} from "./breadth-first-search/breadth-first-search.component";
import {BreadthFirstSearchService} from "./breadth-first-search/breadth-first-search.service";
import {GraphModule} from "./graph/graph.module";

@NgModule({
    declarations: [
        AppComponent,
        BreadthFirstSearchComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        StepperModule,
        GraphModule,
        //StoreModule.provideStore(reducer),
    ],
    providers: [
        BreadthFirstSearchService,
    ],
    bootstrap: [
        AppComponent,
    ],
})
export class AppModule {
}
